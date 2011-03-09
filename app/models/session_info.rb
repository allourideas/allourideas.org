class SessionInfo< ActiveRecord::Base
	serialize :loc_info
	serialize :loc_info_2
	has_many :trials
	has_many :clicks
	has_many :alternatives, :class_name => "Abingo::Alternative", :through => :trials #Tracking A/B tests
	belongs_to :visitor
	belongs_to :user

	after_create :do_geolocate

	def do_geolocate
		logger.info("Doing geolocation after create")
		self.send_later :geolocate!, self.ip_addr
		#delete ip_addr here
	end

	def geolocate!(ip_address)
	      # We want to geolocate using both sources in case one has better information
	      self.loc_info = GEOIP_DB.look_up(ip_address)
	      self.loc_info = {} if self.loc_info.blank? || loc_info[:latitude].nil? || loc_info[:longitude].nil?


	      if(ip_address == "127.0.0.1")
		      logger.info("Private ip - not geolocating ")
	      else
		      loc = Geokit::Geocoders::MultiGeocoder.geocode(ip_address)
		      if loc.success
			      self.loc_info_2= {}
			      self.loc_info_2[:city] = loc.city
			      self.loc_info_2[:region] = loc.state
			      self.loc_info_2[:country_code] = loc.country
			      self.loc_info_2[:latitude] = loc.lat
			      self.loc_info_2[:longitude] = loc.lng
		      end
	      end

	      self.loc_info_2 = {} if self.loc_info_2.blank? || loc_info_2[:latitude].nil? || loc_info_2[:longitude].nil?

              self.ip_addr = Digest::MD5.hexdigest([ip_address, IP_ADDR_HASH_SALT].join(""))
	      self.save
	end

  def find_click_for_vote(vote)
    conditions = ["controller = 'prompts' AND (action = 'vote' OR action='skip') AND created_at <= ?", vote['Created at']]
    vote_click = clicks.find(:first, :conditions => conditions, :order => 'id DESC')
    vote_click = Click.new unless vote_click
    return vote_click
  end

end

