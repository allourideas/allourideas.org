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

    choices.each_with_index do |choice, i|
      choices_sheet.row(i + 1).push(
        choice.id, choice.question_id, choice.wins, choice.losses,
        (choice.wins+choice.losses), choice.score, choice.data, choice.elo_rating
      )

      votes = choice.votes(utm_source)
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

          losing_votes_sheet.row(losing_votes_counter + 1).push(
            vote["id"],  vote["voter_id"], vote["question_id"],
            vote["prompt_id"], vote["choice_id"], vote["loser_choice_id"],
            vote["created_at"], vote["updated_at"], vote["time_viewed"],
            utm_source_out, utm_campaign_out, utm_medium_out
          )
          losing_votes_counter += 1
        end
      end
    end
    # writing the excel file to the given directory
    output_dir = args[:output_folder] || Rails.root.join('tmp') # default to tmp folder if no directory provided
    file_path = File.join(output_dir, 'choice_votes.xls')
    book.write file_path
    puts "Generated choice votes file at: #{file_path}"
  end
end
