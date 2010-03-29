class SessionInfo< ActiveRecord::Base
	serialize :loc_info
	has_many :trials
	has_many :clicks
	has_many :alternatives, :class_name => "Abingo::Alternative", :through => :trials #Tracking A/B tests
	belongs_to :visitor
	belongs_to :user

	def geolocate!(ip_address)
	      self.loc_info = GEOIP_DB.look_up(ip_address)

	      if loc_info.blank?
		      logger.info("Could not geolocate using local db, using geokit")
		      loc = Geokit::Geocoders::MultiGeocoder.geocode(ip_address)
		      if loc.success
			      self.loc_info= {}
			      self.loc_info[:city] = loc.city
			      self.loc_info[:region] = loc.state
			      self.loc_info[:country_code] = loc.country
			      self.loc_info[:latitude] = loc.lat
			      self.loc_info[:longitude] = loc.lng
		      end
	      end

	      self.loc_info = {} if self.loc_info.blank?
	      self.save
	end

end

