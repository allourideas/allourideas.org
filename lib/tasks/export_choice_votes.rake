require 'spreadsheet'
require 'yaml'

namespace :export do
  desc 'Generate Choice Votes'
  task :choice_votes, [:earl_name, :output_folder, :utm_source] => :environment do |task, args|
    earl = Earl.find_by(name: args[:earl_name])
    raise 'Earl not found' unless earl

    question_id = earl.question.id

    utm_source = args[:utm_source]

    puts "Exporting choice votes for question 1 #{question_id} with utm_source #{utm_source}"

    Choice.timeout = 1000000

    choices = if utm_source.present?
                Choice.find(:all, :params => {:question_id => question_id, :limit => 5000, :utm_source => utm_source})
              else
                Choice.find(:all, :params => {:question_id => question_id, :limit => 5000})
              end

    # Define a method to calculate elo rating
    def calculate_elo(rating1, rating2, score1, score2)
      k_factor = 32
      expected1 = 1.0 / (1 + 10 ** ((rating2 - rating1) / 400.0))
      expected2 = 1.0 / (1 + 10 ** ((rating1 - rating2) / 400.0))
      new_rating1 = rating1 + k_factor * (score1 - expected1)
      new_rating2 = rating2 + k_factor * (score2 - expected2)
      return new_rating1, new_rating2
    end

    # Initialize the elo_ratings Hash
    elo_ratings = Hash.new(1500)

    book = Spreadsheet::Workbook.new
    choices_sheet = book.create_worksheet name: 'Choices'
    winning_votes_sheet = book.create_worksheet name: 'Winning Votes'
    losing_votes_sheet = book.create_worksheet name: 'Losing Votes'

    # setting the headers
    choices_headers = ['Id', 'Question Id', 'Wins', 'Losses', 'Votes', 'Score', 'Data','Elo Rating']
    choices_sheet.row(0).concat choices_headers
    votes_headers = ['Id', 'Voter Id', 'Question Id', 'Prompt Id', 'Choice Id', 'Loser Choice Id', 'Created At', 'Updated At', 'Time Viewed', 'UTM Source', 'UTM Campaign', 'UTM Medium', 'UTM Content']
    winning_votes_sheet.row(0).concat votes_headers
    losing_votes_sheet.row(0).concat votes_headers

    # Create a format for the header
    header_format = Spreadsheet::Format.new :weight => :bold

    # Apply the format to the header row
    choices_sheet.row(0).default_format = header_format
    winning_votes_sheet.row(0).default_format = header_format
    losing_votes_sheet.row(0).default_format = header_format

    winning_votes_counter = 0
    losing_votes_counter = 0

    votes_map = {}

    choices.each_with_index do |choice, i|
      choices_sheet.row(i + 1).push(
        choice.id, choice.question_id, choice.wins, choice.losses,
        (choice.wins+choice.losses), choice.score, choice.data
      )

      votes = votes_map[choice] = choice.votes(utm_source)
      if votes
        winning_votes = votes["winning_votes"]
        losing_votes = votes["losing_votes"]

        winning_votes.each do |vote|
          tracking_data = vote["tracking"] if vote["tracking"].present?
          utm_source_out = tracking_data['utm_source'] if tracking_data
          utm_campaign_out = tracking_data['utm_campaign'] if tracking_data
          utm_medium_out = tracking_data['utm_medium'] if tracking_data
          utm_content_out = tracking_data['utm_content'] if tracking_data

          winning_votes_sheet.row(winning_votes_counter + 1).push(
            vote["id"], vote["voter_id"], vote["question_id"],
            vote["prompt_id"], vote["choice_id"], vote["loser_choice_id"],
            vote["created_at"], vote["updated_at"], vote["time_viewed"],
            utm_source_out, utm_campaign_out, utm_medium_out, utm_content_out
          )
          winning_votes_counter += 1
        end

        losing_votes.each do |vote|
          tracking_data = vote["tracking"] if vote["tracking"].present?
          utm_source_out = tracking_data['utm_source'] if tracking_data
          utm_campaign_out = tracking_data['utm_campaign'] if tracking_data
          utm_medium_out = tracking_data['utm_medium'] if tracking_data
          utm_content_out = tracking_data['utm_content'] if tracking_data

          losing_votes_sheet.row(losing_votes_counter + 1).push(
            vote["id"],  vote["voter_id"], vote["question_id"],
            vote["prompt_id"], vote["choice_id"], vote["loser_choice_id"],
            vote["created_at"], vote["updated_at"], vote["time_viewed"],
            utm_source_out, utm_campaign_out, utm_medium_out, utm_content_out
          )
          losing_votes_counter += 1
        end
      end
    end

    choices.each do |choice1|
      choices.each do |choice2|
        next if choice1 == choice2

        votes1 = votes_map[choice1]
        votes2 = votes_map[choice2]

        # Filter votes where choice1 and choice2 were directly compared
        direct_votes1 = votes1["winning_votes"].to_a.select { |vote| vote["loser_choice_id"] == choice2.id }
        direct_votes2 = votes2["winning_votes"].to_a.select { |vote| vote["loser_choice_id"] == choice1.id }

        next if direct_votes1.empty? && direct_votes2.empty?

        score1 = (direct_votes1.count.to_f / (direct_votes1.count + direct_votes2.count))
        score2 = (direct_votes2.count.to_f / (direct_votes2.count + direct_votes1.count))

        elo_ratings[choice1], elo_ratings[choice2] = calculate_elo(elo_ratings[choice1], elo_ratings[choice2], score1, score2)
      end
    end

    choices.each_with_index do |choice, i|
      choices_sheet.row(i + 1).push(elo_ratings[choice])
      puts "Choice #{choice.id} has elo rating #{elo_ratings[choice]}"
    end

    # writing the excel file to the given directory
    output_dir = args[:output_folder] || Rails.root.join('tmp') # default to tmp folder if no directory provided
    file_path = File.join(output_dir, 'choice_votes.xls')
    book.write file_path
    puts "Generated choice votes file at: #{file_path}"
  end
end
