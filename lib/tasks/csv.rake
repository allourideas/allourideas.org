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

  desc "Given a CSV file from AOI with latitude and longitude, update with city, state, country."
  task :lat_long_to_city => :environment do |t, args|
    require 'httparty'
    csvdata = STDIN.read.force_encoding('UTF-8')
    CSVBridge.parse(csvdata, {:headers => :first_row, :return_headers => true}) do |row|
      if row.header_row?
        row.delete('Latitude')
        row.delete('Longitude')
        row << ['City', 'City']
        row << ['State', 'State']
        row << ['Country', 'Country']
        puts row.to_csv
        next
      end

      lat = row['Latitude']
      lon = row['Longitude']
      row.delete('Latitude')
      row.delete('Longitude')
      key = [lat, lon]
      opts = {
        :query => {
          :latlng => "#{lat},#{lon}",
          :key => ENV['API_KEY'],
          :location_type => 'APPROXIMATE',
          :language => 'en',
          :result_type => 'locality',
        },
        #:debug_output => STDERR,
      }
      resp = HTTParty.get('https://maps.googleapis.com/maps/api/geocode/json', opts)
      if resp.parsed_response['results'].length > 0
        addr_components = resp.parsed_response['results'][0]['address_components']
        row << ['City', addr_components.select{ |a| a['types'].include?('locality') }[0]['long_name']]
        row << ['State', addr_components.select{ |a| a['types'].include?('administrative_area_level_1') }[0].try(:[], 'long_name')]
        row << ['Country', addr_components.select{ |a| a['types'].include?('country') }[0]['long_name']]
      else
        row << ['City', nil]
        row << ['State', nil]
        row << ['Country', nil]
      end
      puts row.to_csv
    end
  end

end
