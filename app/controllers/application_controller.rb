class ApplicationController < ActionController::Base
  include Clearance::Authentication
  include HoptoadNotifier::Catcher

  helper :all
  protect_from_forgery
  
  def user_set?
    @current_user ||= auto_create_user!
  end
  
  # Create user object if doesn't already exist.  Set cookie.   
  def auto_create_user!
    #return if signed_in?
    user = RemoteUser.auto_create_user_object_from_sid(request.session_options[:id]) # doesn't save to db as handle remember cookie does.
    #user.status = 'verified' if @verified # user passed captcha, prevents showing captcha again
    #sign_in user # !! now logged in (sets session)
    #handle_remember_cookie! true # sets cookie and saves user so they can get back after session is over
    # cookie set to 5 years.., the above uses @current_user set in previous line.
  end
  
  before_filter :initialize_session, :auto_create_user!
  
  def initialize_session
    puts request.session_options[:id]
    session[:session_id] # this forces load of the session in Rails 2.3.x
    puts request.session_options[:id]
  end
end
