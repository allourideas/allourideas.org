class Earl < ActiveRecord::Base
  @@reserved_names = ["questions", "question", 'about', 'privacy', 'tour', 'no_google_tracking', 'admin', 'abingo', 'earls', 'signup', 'sign_in', 'sign_out','clicks', 'fakequestion']
  validates_presence_of :question_id, :on => :create, :message => "can't be blank"
  validates_presence_of :name, :on => :create, :message => "can't be blank"
  has_friendly_id :name, :use_slug => true, :reserved => @@reserved_names 
  has_attached_file :logo, :whiny_thumbnails => true, :styles => { :medium => "150x150>" }

  belongs_to :user
  
  #TODO refactor params to be an options hash
  def question(barebones = false, algorithm= "standard", visitor_identifier = nil) #including visitor_identifer creates an appearance
	  if barebones == true
	          Question.find(question_id, :params => {:barebones => true, :visitor_identifier =>  visitor_identifier})
	  elsif algorithm == "standard"
		  Question.find(question_id, :params => {:visitor_identifier => visitor_identifier})
	  elsif algorithm == "catchup"
		  logger.info("Catchup algorithm question")
		  Question.find(question_id, :params => {:algorithm => "catchup", :visitor_identifier => visitor_identifier})
	  end
    
  end

  def self.reserved_names
	  @@reserved_names
  end
end
