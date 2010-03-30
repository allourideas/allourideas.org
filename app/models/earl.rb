class Earl < ActiveRecord::Base
  @@reserved_names = ["questions", "question", 'about', 'privacy', 'tour', 'no_google_tracking', 'admin', 'abingo', 'earls', 'signup', 'sign_in', 'sign_out','clicks']
  validates_presence_of :question_id, :on => :create, :message => "can't be blank"
  validates_presence_of :name, :on => :create, :message => "can't be blank"
  has_friendly_id :name, :use_slug => true, :reserved => @@reserved_names 
  has_attached_file :logo, :whiny_thumbnails => true, :styles => { :medium => "150x150>" }

  belongs_to :user
  
  def question(barebones = false, algorithm= "standard")
	  if barebones == true
	          Question.find(question_id, :params => {:barebones => true})
	  elsif algorithm == "standard"
		  Question.find(question_id)
	  elsif algorithm == "catchup"
		  logger.info("Catchup algorithm question")
		  Question.find(question_id, :params => {:algorithm => "catchup"})
	  end
    
  end

  def self.reserved_names
	  @@reserved_names
  end
end
