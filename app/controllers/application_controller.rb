class ApplicationController < ActionController::Base
  include Clearance::Authentication
  include HoptoadNotifier::Catcher
  
  # Options:
  # * :tries - Number of retries to perform. Defaults to 1.
  # * :on - The Exception on which a retry will be performed. Defaults to Exception, which retries on any Exception.
  #
  # Example
  # =======
  #   retryable(:tries => 1, :on => OpenURI::HTTPError) do
  #     # your code here
  #   end
  #
  def retryable(options = {}, &block)
    opts = { :tries => 1, :on => Exception }.merge(options)

    retry_exception, retries = opts[:on], opts[:tries]

    begin
      return yield
    rescue retry_exception
      retry if (retries -= 1) > 0
    end

    yield
  end

  helper :all
  protect_from_forgery
  
  # def user_set?
  #   @current_user ||= auto_create_user!
  # end
  # 
  # Create user object if doesn't already exist.  Set cookie.   
  # def auto_create_user!
  #   #return if signed_in?
  #   user = RemoteUser.auto_create_user_object_from_sid(request.session_options[:id]) # doesn't save to db as handle remember cookie does.
  #   #user.status = 'verified' if @verified # user passed captcha, prevents showing captcha again
  #   #sign_in user # !! now logged in (sets session)
  #   #handle_remember_cookie! true # sets cookie and saves user so they can get back after session is over
  #   # cookie set to 5 years.., the above uses @current_user set in previous line.
  # end
  
  before_filter :initialize_session, :record_action, :set_urls
  
  def set_urls

  end
  
  def initialize_session
    puts request.session_options[:id]
    session[:session_id] # this forces load of the session in Rails 2.3.x

    if (session[:abingo_identity])
	    Abingo.identity = session[:abingo_identity]
    else
	    session[:abingo_identity] = Abingo.identity = rand(10 ** 10).to_i
    end

    puts request.session_options[:id]
    if signed_in?
      logger.info "current user is #{current_user.inspect}"
      #current_user.set_remote_session_key!(request.session_options[:id])
    end
  end
  
  def record_action
    session = SessionInfo.find_or_create_by_session_id(:session_id => request.session_options[:id], 
						       :ip_addr => request.remote_ip, 
						       :user_agent => request.env["HTTP_USER_AGENT"])

    Click.create( :url => request.url, :controller => controller_name, :action => action_name, :user => current_user, 
		 :referrer => request.referrer, :session_info_id => session.id)
    if current_user 
      logger.info "CLICKSTREAM: #{controller_name}##{action_name} by Session #{request.session_options[:id]} (User: #{current_user.email})"
    else
      logger.info "CLICKSTREAM: #{controller_name}##{action_name} by Session #{request.session_options[:id]} (not logged in)"
    end
   #   Click.create( :sid => request.session_options[:id], :ip_addr => request.remote_ip, :url => request.url,
#		   :controller => controller_name, :action => action_name, :user => nil, :referrer => request.referrer)
      
  end

  helper_method :signed_in_as_admin?
  
  def signed_in_as_admin?
    signed_in? && current_user.admin?
  end
  
  def users_only
    deny_access("Please Login or Create an Account to Access that Feature.") unless signed_in?
  end
  
  def admin_only
    deny_access("Please Login as an administrator to Access that Feature.") unless signed_in_as_admin?
  end

	

end
