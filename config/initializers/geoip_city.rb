require 'geoip'
GEOIP_DB = GeoIP::City.new(File.join(RAILS_ROOT, 'db/GeoLiteCity.dat'))
