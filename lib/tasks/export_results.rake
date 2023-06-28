require 'spreadsheet'

namespace :export do
  desc 'Generate Choice Results'
  task :choice_results, [:earl_name, :output_folder, :utm_source] => :environment do |task, args|
    earl = Earl.find_by(name: args[:earl_name])
    raise 'Earl not found' unless earl

    question_id = earl.question.id

    utm_source = args[:utm_source]

    choices = if utm_source.present?
                Choice.find(:all, :params => {:question_id => question_id, :limit => 5000, :utm_source => utm_source})
              else
                Choice.find(:all, :params => {:question_id => question_id, :limit => 5000})
              end

    # Sort choices by score
    choices.sort_by! { |choice| -choice.score }

    book = Spreadsheet::Workbook.new
    sheet = book.create_worksheet name: 'Choice Results'

    # setting the headers
    headers = ['Id', 'Question Id', 'Wins', 'Losses', 'Votes','Score', 'Data']
    sheet.row(0).concat headers

    # populate data rows
    choices.each_with_index do |choice, i|
      sheet.row(i + 1).push(
        choice.id, choice.question_id, choice.wins, choice.losses,
        (choice.wins+choice.losses), choice.score, choice.data
      )
    end

    # writing the excel file to the given directory
    output_dir = args[:output_folder] || Rails.root.join('tmp') # default to tmp folder if no directory provided
    file_path = File.join(output_dir, 'choice_results.xls')
    book.write file_path
    puts "Generated choice results file at: #{file_path}"
  end
end
