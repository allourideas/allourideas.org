class ApplicationController < ActionController::Base
  include Clearance::Authentication
  
  helper :all
  protect_from_forgery
  
  before_filter :initialize_session, :set_session_timestamp, :record_action, :view_filter, :set_pairwise_credentials, :set_locale, :set_p3p_header, :widget_has_redirected

  # preprocess photocracy_view_path on boot because
  # doing pathset generation during a request is very costly.
  cattr_accessor :photocracy_view_path
  cattr_accessor :widget_view_path
  @@photocracy_view_path = ActionView::Base.process_view_paths(File.join(Rails.root, "app", "views", "photocracy"))
  @@widget_view_path = ActionView::Base.process_view_paths(File.join(Rails.root, "app", "views", "widget")) 

  # for the widget third-party cookie busting attempts
  # check redis to see if we've redirected this client
  # if we have, then we won't attempt to do so again
  def widget_has_redirected
    @widget_has_redirected = false
    return unless @widget
    r = Redis.new(:host => REDIS_CONFIG['hostname'])
    redis_key = "redirect_" + Digest::MD5.hexdigest("#{request.remote_ip} #{request.env["HTTP_USER_AGENT"]} #{request.referer}")
    if r.get(redis_key) == "1"
      @widget_has_redirected = true
    end
  end

  def view_filter
    if request.url.include?('photocracy') || request.url.include?('fotocracy') || @photocracy || (RAILS_ENV == 'test' && $PHOTOCRACY)
      @photocracy = true
      prepend_view_path(@@photocracy_view_path)
    elsif request.url.include?('widget') || request.env['SERVER_NAME'].include?('iphone') || @widget
      @widget= true
      @widget_stylesheet = "widget/screen"
      prepend_view_path(@@widget_view_path)
    end
  end

  def set_pairwise_credentials
    SiteConfig.set_pairwise_credentials(@photocracy)
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

  helper_method :show_aoi_nav?
  def show_aoi_nav?
    return !white_label_request? && (controller_name == 'home' || (controller_name == 'questions' && action_name == 'new'))
  end

  def set_session_timestamp
      # ActiveResource::HttpMock only matches static strings for query parameters
      # when in test set this to a static value, so we can match the resulting API queries for mocking
      request.session_options[:id] = "test123" if Rails.env == "test"
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
      I18n.load_path = Dir[Rails.root.join('config', 'locales', 'photocracy', '*.{rb,yml}')]
    else
      I18n.load_path = Dir[Rails.root.join('config', 'locales', 'allourideas', '*.{rb,yml}')]
    end
    I18n.load_path.concat Dir[Rails.root.join('config', 'locales', 'rails', '*.{rb,yml}')]
    I18n.reload!

    if params[:locale].blank?
      I18n.locale = I18n.default_locale
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
    #notify_airbrake(exception) 
    render :template => "errors/404.html.haml", :status => 404
  end
  
  def render_error(exception)
    log_error(exception)
    notify_airbrake(exception)

    render :template => "errors/500.html.haml", :status => 500
  end

  helper_method :wikipedia?
  def wikipedia?
    if @earl
      @earl.name == 'wikipedia-banner-challenge'
    elsif controller_name == 'questions' && params[:id]
      e = Earl.find_by_name('wikipedia-banner-challenge')
      !e.blank? && e.question_id == params[:id].to_i
    end
  end
end
