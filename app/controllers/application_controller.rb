class ApplicationController < ActionController::Base
  include Clearance::Authentication
  
  helper :all
  protect_from_forgery
  
  before_filter :initialize_session, :set_session_timestamp, :record_action, :view_filter, :set_pairwise_credentials, :set_locale, :set_p3p_header

  # preprocess photocracy_view_path on boot because
  # doing pathset generation during a request is very costly.
  cattr_accessor :photocracy_view_path
  cattr_accessor :widget_view_path
  @@photocracy_view_path = ActionView::Base.process_view_paths(File.join(Rails.root, "app", "views", "photocracy"))
  @@widget_view_path = ActionView::Base.process_view_paths(File.join(Rails.root, "app", "views", "widget")) 

  def view_filter
    if request.url.include?('photocracy') || request.url.include?('fotocracy') || @photocracy || $PHOTOCRACY
      @photocracy = true
      prepend_view_path(@@photocracy_view_path)
    elsif request.url.include?('widget') || request.url.include?('iphone') || @widget
      @widget= true
      prepend_view_path(@@widget_view_path)
    end
  end

  def set_pairwise_credentials
    if @photocracy
       username = PHOTOCRACY_USERNAME
       password = PHOTOCRACY_PASSWORD
       $PHOTOCRACY = true
    else
       username = PAIRWISE_USERNAME
       password = PAIRWISE_PASSWORD
       $PHOTOCRACY = false
    end
    active_resource_classes = [Choice, Density, Prompt, Question, Session]
    active_resource_classes.each do |klass|
      klass.user = username
      klass.password = password
    end
  end
  
  def initialize_session
    session[:session_id] # this forces load of the session in Rails 2.3.x
    if signed_in?
      logger.info "current user is #{current_user.inspect}"
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

  def set_session_timestamp
      expiration_time = session[:expiration_time]
      if expiration_time && expiration_time < Time.now
	   session[:session_id] = ActiveSupport::SecureRandom.hex(16)
	   request.session_options[:id] = session[:session_id]
      end
      session[:expiration_time] = 10.minutes.from_now
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

  def earl_owner_or_admin_only
    @earl = Earl.find(params[:question_id])
    unless (current_user && (current_user.owns?(@earl) || current_user.admin?))
    	deny_access(t('user.not_authorized_error'))
    end
  end

  def set_locale
    if @photocracy
      if params[:locale].blank?
        I18n.locale = ('photocracy_' + I18n.default_locale.to_s).to_sym
      else
	      I18n.locale = "#{'photocracy_' unless params[:locale].starts_with?('photocracy_')}#{params[:locale]}".to_sym
      end
    else
      I18n.locale = params[:locale]
    end
  end


  def default_url_options(options={})
    if I18n.locale != I18n.default_locale
  	  options.merge!({ :locale => I18n.locale })
    end
    if Rails.env == "cucumber" && @photocracy
          options.merge!({:photocracy_mode => true})
    end
  end

  def set_p3p_header
    response.headers['P3P'] = 'policyref="/w3c/p3p.xml", CP="NOI CURa ADMa DEVa PSAa OUR SAMa IND NAV CNT LOC OTC"'
  end

  #customize error messages
  unless ActionController::Base.consider_all_requests_local
    rescue_from Exception,                            :with => :render_error
    rescue_from ActiveRecord::RecordNotFound,         :with => :render_not_found
    rescue_from ActionController::RoutingError,       :with => :render_not_found
    rescue_from ActionController::UnknownController,  :with => :render_not_found
    rescue_from ActionController::UnknownAction,      :with => :render_not_found
    rescue_from ActiveResource::ResourceNotFound,     :with => :render_not_found
  end 

  def render_not_found(exception)
    log_error(exception)
    #notify_hoptoad(exception) 
    render :template => "errors/404.html.haml", :status => 404
  end
  
  def render_error(exception)
    log_error(exception)
    notify_hoptoad(exception)

    render :template => "errors/500.html.haml", :status => 500
  end

end
