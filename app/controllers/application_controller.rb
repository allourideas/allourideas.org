class ApplicationController < ActionController::Base
  include Clearance::Controller
  # include Clearance::Authentication

  helper :all
  protect_from_forgery

  before_action :initialize_session,
    :get_survey_session,
    :record_action,
    :view_filter,
    :set_pairwise_credentials,
    :set_locale,
    :set_p3p_header
  after_action :write_survey_session_cookie

  def view_filter
    if request.url.include?('photocracy') || request.url.include?('fotocracy') || @photocracy || (Rails.env.test? && $PHOTOCRACY)
      @photocracy = true
      prepend_view_path(File.join(Rails.root, "app", "views", "photocracy"))
    elsif request.url.include?('widget') || request.env['SERVER_NAME'].include?('iphone') || @widget
      @widget= true
      @widget_stylesheet = "widget/screen"
      response.headers["X-FRAME-OPTIONS"] = 'ALLOWALL'
      prepend_view_path(File.join(Rails.root, "app", "views", "widget"))
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
    # Appearance_lookup can act like an authenticity token because
    # get_survey_session will raise an error if no cookie found with proper appearance_lookup
    raise(ActionController::InvalidAuthenticityToken) unless params[:appearance_lookup]
  end

  # This method sets question_id based on the URL and parameters of the request
  # We want to know the question_id early in the request process because we
  # use it to determine the proper session for this request.
  #
  # The different controller / actions have differing ways of determining the
  # question_id. Some are only passed the Earl.name, while others get the
  # question_id directly as a parameter.
  #
  # Some requests like the homepage will have @question_id = nil. This is
  # okay as they don't pass any session information to pairwise. A separate
  # session is kept for requests that have no question_id.
  def set_question_id_earl
    @question_id = nil
    if controller_name == 'earls' and ['show', 'verify'].include? action_name
      @earl = Earl.find_by(name: params[:id].to_s)
      @question_id = @earl.try(:question_id)
    elsif controller_name == 'prompts'
      @question_id = params[:question_id]
    elsif controller_name == 'questions'
      if ['add_idea', 'visitor_voting_history'].include?(action_name)
        @question_id = params[:id]
      elsif ['results', 'about', 'admin', 'update_name'].include?(action_name)
        @earl = Earl.find_by(name: params[:id].to_s)
        @question_id = @earl.try(:question_id)
      end
    elsif controller_name == 'choices'
      if action_name == 'toggle'
        @earl = Earl.find(params[:earl_id])
      else
        @earl = Earl.find_by(name: params[:question_id].to_s)
      end
      @question_id = @earl.try(:question_id)
    end
  end

  # Called as a before_filter.
  def get_survey_session
    # First order of business is to set the question_id.
    set_question_id_earl

    begin
      # Based on the cookies, question_id, and appearance_lookup, find the
      # proper session for this request.
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
    # Create new SurveySession object for this request.
    @survey_session = SurveySession.send(:new, *session_data)
    if @survey_session.expired?
      # This will regenerate the session_id, saving the old one.
      # We can send along both the new and old session_id to pairwise
      # for requests that have sessions that have expired.
      @survey_session.regenerate
    end

    # We want the session to expire after X minutes of inactivity, so update
    # the expiry with every request.
    @survey_session.update_expiry
  end

  # Called as a after_filter to ensure we pass along the updated survey session
  # cookie in the response to this request.
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

    visitor = Visitor.find_or_create_by(:remember_token => visitor_remember_token)
    user_session = SessionInfo.where(:session_id => @survey_session.session_id,
                   :ip_addr => request.remote_ip,
                   :user_agent => request.env["HTTP_USER_AGENT"],
                   :white_label_request => white_label_request?,
                   :visitor_id => visitor.id).first_or_create
    user_session.save(validate: false) if user_session.new_record?
    @user_session = user_session

    sql = ActiveRecord::Base.send(:sanitize_sql_array, ["INSERT INTO `clicks` (`url`, `controller`, `action`, `user_id`, `referrer`, `session_info_id`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", request.url, controller_name, action_name, current_user.try(:id), request.referrer, user_session.try(:id), Time.now.utc, Time.now.utc])
    ActiveRecord::Base.connection.execute(sql)

    if current_user && !user_session.user_id
      user_session.user_id = current_user.id
      user_session.save!
    end

    #if (session[:abingo_identity])
    #  Abingo.identity = session[:abingo_identity]
    #else
    #  session[:abingo_identity] = user_session.id
    #  Abingo.identity = user_session.id
    #end

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
    options
  end

  def set_p3p_header
    response.headers['P3P'] = 'policyref="/w3c/p3p.xml", CP="NOI CURa ADMa DEVa PSAa OUR SAMa IND NAV CNT LOC OTC"'
  end

  #customize error messages
  #rescue_from Exception,                            :with => :render_error
  #unless ActionController::Base.consider_all_requests_local
  #  rescue_from ActiveRecord::RecordNotFound,         :with => :render_not_found
  #  rescue_from ActionController::RoutingError,       :with => :render_not_found
  #  rescue_from ActionController::UnknownController,  :with => :render_not_found
  #  rescue_from ActionController::UnknownAction,      :with => :render_not_found
  #  rescue_from ActiveResource::ResourceNotFound,     :with => :render_not_found
  #end

  def render_not_found(exception)
    log_error(exception)
    render :template => "errors/404.html.haml", :status => 404
  end

  def render_error(exception)
    log_error(exception)
    #Bugsnag.notify(exception) do |report|
    #  report.severity = "error"
    #end

    respond_to do |format|
      format.html { render :template => "errors/500.html.haml", :status => 500 }
      format.js   { render :json => {:error => exception.class.name}.to_json, :status => 500 }
    end
  end

  helper_method :wikipedia?
  def wikipedia?
    if @earl
      @earl.name == 'wikipedia-banner-challenge'
    elsif controller_name == 'questions' && params[:id]
      e = Earl.find_by(name: 'wikipedia-banner-challenge')
      !e.blank? && e.question_id == params[:id].to_i
    end
  end
end
