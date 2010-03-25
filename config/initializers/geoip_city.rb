require 'geoip_city'
GEOIP_DB = GeoIPCity::Database.new(File.join(RAILS_ROOT, 'db/GeoLiteCity.dat'))
