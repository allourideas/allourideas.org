class ChangeSessionInfoLocationToGeoIpCityFormat < ActiveRecord::Migration[4.2]
  def self.up
	  SessionInfo.find_each do |s|
		  if s.ip_addr
			  s.geolocate!(s.ip_addr)
		  end
	  end
  end

  def self.down
  end
end
