module ApplicationHelper
  def body_class
    "#{controller.controller_name} #{controller.controller_name}-#{controller.action_name}"
  end
  
  def logged_in?
    signed_in?
  end

  def percentage(num, denom)
    @controller.percentage(num, denom)
  end

  def google_maps_key
    if @controller.request.env['SERVER_NAME'] =~ /allourideas/
      # allourideas.org
      'ABQIAAAAYF1X_Xk6WVB2CJtN2ceMNRTLCQwoxxEaAy7MVXgS8jhkwc-a1hQayD28z5vhzz9k8nBR7mUClbkciQ'
    else
      # compairwise.photocracy.org
      'ABQIAAAAYF1X_Xk6WVB2CJtN2ceMNRSiwqBVK9UCwh-neRGNZQGFqE8clRQUTXNArLqWIfILMbRsjgmsvO3XEg'
    end
  end

  def status(active)
    active ? t('common.active') : t('common.inactive')
  end

  def vote_quick_link(default)
    q = Question.find(1)
    q && q.name && !q.name.empty? ? @controller.named_url_for_question(q) : default
  end

  def quick_link(uri, default)
    unless @name
      q = Question.find(1)
      @name = q && q.name && !q.name.empty? ? q.name : true
    end
    @name == true ? default : "/#{@name}/#{uri}"
  end
  
  def user_set?
     @current_user ||= auto_create_user!
  end
  
  def auto_create_user!
    @autouser ||= User.auto_create_user_object_from_sid(request.session_options[:id])
  end

  def log_or_new_path
    user_set? ? new_question_path : new_user_path
  end

  def class_for_nav(params, action, controller = 'home')
    params[:controller] == controller && params[:action] == action ? { :class => 'down' } : {}
  end

  def rounded(content, classes = "border")
    render(:partial => 'shared/rounded', :locals => { :classes => classes, :content => content })
  end

  def login_or_users_path
    @controller.user_set? ? users_path : login_path
  end
end
