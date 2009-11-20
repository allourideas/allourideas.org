class User < ActiveRecord::Base
  include Clearance::User
  
  def remote_user(sid)
    unless remote_user_id.blank?
      RemoteUser.find(remote_user_id)
    else
      u = RemoteUser.find_by_sid(sid)
      self.remote_user_id = u.attributes['id']
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