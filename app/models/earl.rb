class Earl < ActiveRecord::Base
  @@reserved_names = ["questions", "question", 'about', 'privacy', 'tour', 'no_google_tracking', 'admin', 'abingo', 'earls', 'signup', 'sign_in', 'sign_out','clicks', 'fakequestion', 'photocracy', 'fotocracy']
  validates_presence_of :question_id, :on => :create, :message => "can't be blank"
  validates_presence_of :name, :on => :create, :message => "can't be blank"
  validates_length_of :welcome_message, :maximum=>350, :allow_nil => true, :allow_blank => true
  has_friendly_id :name, :use_slug => true, :reserved => @@reserved_names 
  has_attached_file :logo, :whiny_thumbnails => true, :styles => { :banner => "450x47>", :medium => "150x150>" }

  belongs_to :user
  
  def self.reserved_names
    @@reserved_names
  end

end
