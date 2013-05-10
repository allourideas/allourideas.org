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
    self.delay.geolocate!(self.ip_addr)
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

    self.ip_addr = Digest::MD5.hexdigest([ip_address, APP_CONFIG[:IP_ADDR_HASH_SALT]].join(""))
    self.save

    # find any similiar pending jobs and copy over data
    similar_jobs = Delayed::Job.find(:all,
        :conditions => ["handler REGEXP ? AND locked_by IS NULL",
            "object: LOAD;SessionInfo;.*method: :geolocate!.*- #{Regexp.escape(ip_address)}[[:space:]]"])
    completed_job_ids = []
    similar_jobs.each do |job|
      handler = YAML.load(job.handler)
      object_parts = handler.object.split(';')
      if object_parts.length == 3 && object_parts[0] == 'LOAD' && object_parts[1] == 'SessionInfo'
        session_info = object_parts[1].constantize.find(object_parts[2])
        session_info.loc_info   = self.loc_info
        session_info.loc_info_2 = self.loc_info_2
        session_info.ip_addr    = self.ip_addr
        session_info.save
        completed_job_ids.push(job.id)
      end
    end
    if completed_job_ids.length > 0
      Delayed::Job.delete_all(["id IN (?) AND locked_by IS NULL", completed_job_ids])
    end
  end

  def find_click_for_vote(vote)
    conditions = ["controller = 'prompts' AND (action = 'vote' OR action='skip') AND created_at <= ?", vote['Created at']]
    vote_click = clicks.find(:first, :conditions => conditions, :order => 'id DESC')
    vote_click = Click.new unless vote_click
    return vote_click
  end

  def find_info_value(vote)
    conditions = ["created_at <= ? AND referrer LIKE '%info=%'", vote['Created at']]
    ref_ts = clicks.find(:all, :conditions => conditions, :order => 'id DESC')
    
    info = ref_ts.map do |ref|
      begin
        CGI.parse(URI.parse(ref.referrer).query)['info']
      rescue
        nil
      end
    end.flatten.compact.first
  end

end

