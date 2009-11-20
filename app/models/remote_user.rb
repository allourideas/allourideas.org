class RemoteUser < ActiveResource::Base
   self.site = "http://pairwise.heroku.com/"
   self.element_name = "user"
   
   #include Clearance::User
   
  def self.find_by_sid(sid)
     u = RemoteUser.get(:find_by_sid, :params => {:auto => sid})
     puts u.inspect + " is the result of find_by_sid"
     return u
  end
  
  def email_confirmed?
    attributes['email_confirmed']
  end
  
  def self.auto_create_user_object_from_sid(sid)
    #u = User.new
    #u.save(:params => {:auto => sid})
    @user ||= RemoteUser.post(:autocreate, :params => {:auto => sid})
    return @user
    # User.post(:create, :params => {:auto => sid})
    # u = User.find_by_e
    # 
    # 
    # username = "AOI_#{sid}"
    # u = User.new(:email => "#{username}-autocreated_user@allourideas.heroku.com")
    # u.password = Digest::SHA1.hexdigest( Time.now.to_s.split(//).sort_by {rand}.join ).slice(0,19)
    # u.password_confirmation = u.password
    # u.email_confirmed = true
    # def u.make_activation_code #don't need to do it if using RPX, so we temporarily override the activation
    #   @activated = true
    #   self.activated_at = Time.now.utc
    #   self.activation_code = nil
    # end
    # u.save!
    # return u
  end
end
