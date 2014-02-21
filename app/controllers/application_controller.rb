class ApplicationController < ActionController::Base
  include Clearance::Authentication

  helper :all
  protect_from_forgery
  
  before_filter :initialize_session, :get_survey_session, :record_action, :view_filter, :set_pairwise_credentials, :set_locale, :set_p3p_header
  after_filter :write_survey_session_cookie

  # preprocess photocracy_view_path on boot because
  # doing pathset generation during a request is very costly.
  cattr_accessor :photocracy_view_path
  cattr_accessor :widget_view_path
  @@photocracy_view_path = ActionView::Base.process_view_paths(File.join(Rails.root, "app", "views", "photocracy"))
  @@widget_view_path = ActionView::Base.process_view_paths(File.join(Rails.root, "app", "views", "widget")) 

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

  # called when the request is not verified via the authenticity_token
  def handle_unverified_request
    super
    # Appearance_lookup can act like an authenticity token.
    # get_survey_session will raise an error if no cookie found with proper appearance_lookup
    raise(ActionController::InvalidAuthenticityToken) unless params[:appearance_lookup]
  end

  def set_question_id_earl
    @question_id = nil
    if [controller_name, action_name] == ['earls', 'show']
      @earl = Earl.find_by_name(params[:id])
      @question_id = @earl.try(:question_id)
    elsif controller_name == 'prompts'
      @question_id = params[:question_id]
    elsif controller_name == 'questions'
      if ['add_idea', 'visitor_voting_history'].include?(action_name)
        @question_id = params[:id]
      elsif ['results', 'about', 'admin', 'update_name'].include?(action_name)
        @earl = Earl.find_by_name(params[:id])
        @question_id = @earl.try(:question_id)
      end
    elsif controller_name == 'choices'
      if action_name == 'toggle'
        @earl = Earl.find(params[:earl_id])
      else
        @earl = Earl.find_by_name(params[:question_id])
      end
      @question_id = @earl.try(:question_id)
    end
  end

  def get_survey_session
    set_question_id_earl

    begin
      session_data = SurveySession.find(cookies, @question_id, params[:appearance_lookup])
    rescue CantFindSessionFromCookies => e
      # if no appearance_lookup, then we can safely create a new sesssion
      # otherwise this request ought to fail as they are attempting some action
      # without the proper session being found
      if params[:appearance_lookup].nil?
        session_data = [{:question_id => @question_id }]
      else
        raise e
      end
    end
    @survey_session = SurveySession.send(:new, *session_data)
    if @survey_session.expired?
      @survey_session.regenerate
    end
    @survey_session.update_expiry
  end

  def write_survey_session_cookie
    cookies[@survey_session.cookie_name] = {
      :value => @survey_session.cookie_value
    }
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
    user_session = SessionInfo.find_or_create_by_session_id(:session_id => @survey_session.session_id,
						       :ip_addr => request.remote_ip,
						       :user_agent => request.env["HTTP_USER_AGENT"],
						       :white_label_request => white_label_request?, 
						       :visitor_id => visitor.id)
    @user_session = user_session

    sql = ActiveRecord::Base.send(:sanitize_sql_array, ["INSERT INTO `clicks` (`url`, `controller`, `action`, `user_id`, `referrer`, `session_info_id`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", request.url, controller_name, action_name, current_user.try(:id), request.referrer, user_session.try(:id), Time.now.utc, Time.now.utc])
    ActiveRecord::Base.connection.execute(sql)

    if current_user && !user_session.user_id
	    user_session.user_id = current_user.id
	    user_session.save!
    end

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
