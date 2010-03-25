class SessionInfo< ActiveRecord::Base
	serialize :loc_info
	has_many :trials
	has_many :clicks
	has_many :alternatives, :class_name => "Abingo::Alternative", :through => :trials #Tracking A/B tests
	belongs_to :visitor
	belongs_to :user

	def geolocate!(ip_address)
	      self.loc_info = GEOIP_DB.look_up(ip_address)
	      self.loc_info = {} if self.loc_info.nil?

	      self.save
	end

end

