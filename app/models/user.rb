class User < ActiveRecord::Base
  include Clearance::User
  attr_accessible :default
  
  def set_remote_session_key!(sid)
    puts "inside User.set_remote_session_key"
    remote_user.set_remote_session_key!(sid)
  end
  
  # def self.default_user
  #   #implemented on the Pairwise side instead
  # end
  
  # def remote_user(sid = nil)
  #   puts "inside User#remote_user"
  #   unless remote_user_id.blank?
  #     RemoteUser.find(remote_user_id)
  #   else
  #     return nil if sid.nil?
  #     #u = RemoteUser.find_by_sid(sid)
  #     u = RemoteUser.auto_create_user_object_from_sid(sid)
  #     u = RemoteUser.find_by_sid(sid)
  #     self.remote_user_id = u['id']
  #     save!
  #     return u
  #   end
  # end
  
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
  
  # def associate_with_remote_user(sid)
  #   u = remote_user(sid)
  #   u.email = email
  #   u.password = password
  #   u.password_confirmation = password
  #   #u.current_session_key = sid
  #   u.save
  # end
  # 
  # def associate_with_remote_user(sid = nil)
  # 
  #     
  #   end
  # end
  
end