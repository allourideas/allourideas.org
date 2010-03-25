class ChangeSessionInfoLocationToGeoIpCityFormat < ActiveRecord::Migration
  def self.up
	  SessionInfo.find(:all).each do |s|
		  if s.ip_addr
			  s.geolocate!(s.ip_addr)
		  end
	  end
  end

  def self.down
  end
end
