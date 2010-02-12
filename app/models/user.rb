class User < ActiveRecord::Base
  include Clearance::User
  has_many :earls
  attr_accessible :default
  before_validation_on_create :set_confirmed_email
  
  def owns?(earl)
    earl.user_id == id
  end
  
  def set_remote_session_key!(sid)
    puts "inside User.set_remote_session_key"
    remote_user.set_remote_session_key!(sid)
  end
  
  def remote_user(sid = nil)
    puts "inside User#remote_user"
    unless remote_user_id.blank?
      RemoteUser.find(remote_user_id)
    else
      #create remote user
      return nil if sid.nil?
      u = RemoteUser.auto_create_user_object_from_sid(sid)
      u = RemoteUser.find_by_sid(sid)
      
      self.remote_user_id = u['id']
      save!
      return u
    end
  end

  def email_activated=(value)
      self.email_confirmed = value
  end

  def set_confirmed_email
      self.email_activated = true
  end

  def admin?
      self.admin
  end
  
end
