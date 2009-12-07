class RemoteUser < ActiveResource::Base
   self.site = "#{API_HOST}/"
   self.element_name = "user"
   
   #include Clearance::User
   
  def self.find_by_sid(sid)
     u = RemoteUser.get(:find_by_sid, :params => {:auto => sid})
     puts u.inspect + " is the result of find_by_sid"
     return u
  end
  
  def set_remote_session_key!(sid)
    post(:set, :params => {:auto => sid})
  end
  
  def latest_question
    Question.find(attributes['latest_question_id'].to_i) rescue nil
  end
  
  def email_confirmed?
    attributes['email_confirmed']
  end
  
  def self.auto_create_user_object_from_sid(sid)
    @user ||= RemoteUser.post(:autocreate, :params => {:auto => sid})
    return @user
  end
end
