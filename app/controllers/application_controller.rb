class ApplicationController < ActionController::Base
  include Clearance::Authentication
  
  helper :all
  protect_from_forgery
  
  before_filter :initialize_session, :record_action, :set_urls, :set_locale
  
  def set_urls

  end
  
  def initialize_session
    session[:session_id] # this forces load of the session in Rails 2.3.x
    if signed_in?
      logger.info "current user is #{current_user.inspect}"
      #current_user.set_remote_session_key!(request.session_options[:id])
    end

    if white_label_request?
      logger.info "white_label request - no header and footer displayed"
    end
  end

  helper_method :white_label_request?
  def white_label_request?
	  @_white_label ||= session[:white_label]
	  if @_white_label.nil?
		  if params[:white_label] == "true"
			 @_white_label = session[:white_label] = true
		  else
			 @_white_label = session[:white_label] = false
		  end
	  end
	  @_white_label
  end

  
  def record_action
    visitor_remember_token = cookies[:visitor_remember_token]

    unless visitor_remember_token
	  visitor_remember_token = Digest::SHA1.hexdigest("--#{Time.now.utc}--#{rand(10**10)}--")

          cookies[:visitor_remember_token] = {
            :value   => visitor_remember_token, 
            :expires => 10.years.from_now.utc
          }
    end

    visitor = Visitor.find_or_create_by_remember_token(:remember_token => visitor_remember_token)

    user_session = SessionInfo.find_or_create_by_session_id(:session_id => request.session_options[:id], 
						       :ip_addr => request.remote_ip,
						       :user_agent => request.env["HTTP_USER_AGENT"],
						       :white_label_request => white_label_request?, 
						       :visitor_id => visitor.id)
#    if user_session.new_record?
#	    logger.info "New user, creating job to geolocate ip address #{request.remote_ip}"
#	    user_session.send_later :geolocate!, request.remote_ip
#    end

    Click.create( :url => request.url, :controller => controller_name, :action => action_name, :user => current_user, 
		 :referrer => request.referrer, :session_info_id => user_session.id)

    if current_user && !user_session.user_id
	    user_session.user_id = current_user.id
	    user_session.save!
    end

    if current_user 
      logger.info "CLICKSTREAM: #{controller_name}##{action_name} by Session #{request.session_options[:id]} (User: #{current_user.email})"
    else
      logger.info "CLICKSTREAM: #{controller_name}##{action_name} by Session #{request.session_options[:id]} (not logged in)"
    end
   #   Click.create( :sid => request.session_options[:id], :ip_addr => request.remote_ip, :url => request.url,
#		   :controller => controller_name, :action => action_name, :user => nil, :referrer => request.referrer)
    if (session[:abingo_identity])
	    Abingo.identity = session[:abingo_identity]
    else
	    session[:abingo_identity] = user_session.id
	    Abingo.identity = user_session.id
    end
      
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

  def set_locale
	  I18n.locale = params[:locale]
  end


  def default_url_options(options={})
	  if I18n.locale != I18n.default_locale
		  { :locale => I18n.locale }
	  end
  end

end
