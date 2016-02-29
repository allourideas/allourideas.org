namespace :csv do

  desc "Run munge_csv_data portion of CSV export process. Expects CSV input file on STDIN."
  task :munge_csv_data, [:question_id, :type, :output_file] => :environment do |t, args|
    earl = Earl.find_by_question_id(args[:question_id])
    csvdata = STDIN.read.force_encoding('UTF-8')
    File.open(args[:output_file], 'w', :external_encoding => Encoding::UTF_8) do |file|
      earl.munge_csv_data(csvdata, args[:type]).each do |row|
        file.write(row)
        file.flush
      end
    end
  end

end
