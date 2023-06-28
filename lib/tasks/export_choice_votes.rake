require 'spreadsheet'

namespace :export do
  desc 'Generate Choice Votes'
  task :choice_votes, [:earl_name, :output_folder, :utm_source] => :environment do |task, args|
    earl = Earl.find_by(name: args[:earl_name])
    raise 'Earl not found' unless earl

    question_id = earl.question.id

    utm_source = args[:utm_source]

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
    choices_headers = ['Id', 'Question Id', 'Wins', 'Losses', 'Votes', 'Score', 'Data']
    choices_sheet.row(0).concat choices_headers
    votes_headers = ['Id', 'Site Id', 'Voter Id', 'Question Id', 'Prompt Id', 'Choice Id', 'Loser Choice Id', 'Created At', 'Updated At', 'Time Viewed']
    winning_votes_sheet.row(0).concat votes_headers
    losing_votes_sheet.row(0).concat votes_headers

   # populate data rows
    choices.each_with_index do |choice, i|
      choices_sheet.row(i + 1).push(
        choice.id, choice.question_id, choice.wins, choice.losses,
        (choice.wins+choice.losses), choice.score, choice.data
      )

      votes = choice.votes(utm_source)
      if votes
        winning_votes = votes["winning_votes"]
        losing_votes = votes["losing_votes"]

        winning_votes.each_with_index do |vote, j|
          winning_votes_sheet.row(j + 1).push(
            vote["id"], vote["site_id"], vote["voter_id"], vote["question_id"],
            vote["prompt_id"], vote["choice_id"], vote["loser_choice_id"],
            vote["created_at"], vote["updated_at"], vote["time_viewed"]
          )
        end

        losing_votes.each_with_index do |vote, k|
          losing_votes_sheet.row(k + 1).push(
            vote["id"], vote["site_id"], vote["voter_id"], vote["question_id"],
            vote["prompt_id"], vote["choice_id"], vote["loser_choice_id"],
            vote["created_at"], vote["updated_at"], vote["time_viewed"]
          )
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
