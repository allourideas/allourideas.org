class EarlsController < ApplicationController
  #caches_page :show
  include ActionView::Helpers::TextHelper
  require 'fastercsv'
  
  
  before_filter :dumb_cleartext_authentication, :except => :export_list
  
  def show
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    session[:on_example] = (params[:id] == 'studentgovernment')
    session[:welcome_msg] = @earl.welcome_msg.blank? ? nil: @earl.welcome_msg 
    
    catchup_marketplaces = ["test0330", "studentgovernment", "priority_example", "crsAWCpilot"]
    if @earl
      unless @earl.active?
        flash[:notice] = t('questions.not_active_error')
        redirect_to '/' and return
      end

      if params[:locale].nil? && @earl.default_lang != I18n.default_locale.to_s
	      I18n.locale = @earl.default_lang

	      redirect_to :action => :show, :controller => :earls, :id => @earl.name and return
      end
      if catchup_marketplaces.include?(@earl.name)
	      @question = @earl.question(false, "catchup", request.session_options[:id])
      else
	      @question = @earl.question(false, "standard", request.session_options[:id])#the question has a prompt id with it
      end


       logger.info "inside questions#show " + @question.inspect
       @prompt = Prompt.find(@question.attributes['picked_prompt_id'], :params => {:question_id => @question.id})
       session[:current_prompt_id] = @question.attributes['picked_prompt_id']
       session[:appearance_lookup] = @question.attributes['appearance_id']

       #@items = @question.items
       @right_choice_text = @prompt.right_choice_text
       @left_choice_text = @prompt.left_choice_text
       @left_choice_id = @prompt.left_choice_id
       @right_choice_id = @prompt.right_choice_id
       
       @item_count = @question.attributes['item_count'] - @question.attributes["inactive_choices_count"]
       @votes_count = @question.attributes['votes_count']

       @ab_test_name = (params[:id] == 'studentgovernment') ? "studgov_test_size_of_X_votes_on_Y_ideas2" : 
       								"#{@earl.name}_#{@earl.question_id}_test_size_of_X_votes_on_Y_ideas"	       
       @ab_test_ideas_text_name = "#{@earl.name}_#{@earl.question_id}_test_contents_of_idea_submit_box"	       
       @ab_test_stackoverflow_name = "#{@earl.name}_#{@earl.question_id}_test_stackoverflow_welcome"	       
      # # logger.info "redirecting"
      # # 
      render :controller => "Questions", :action => "show"
    else
      redirect_to('/') and return
    end
  end
  
  def export_list
     authenticate

     unless current_user.admin?
       flash[:notice] = "You are not authorized to export data"
       redirect_to( {:action => :index, :controller => :home}) and return
     end
     @earls= Earl.find(:all)
     outfile = "question_list_" + Time.now.strftime("%m-%d-%Y") + ".csv"
     headers = ['Earl ID', 'Name', 'Question ID', 'Creator ID', 'Active', 'Has Logo', 'Has Password',
                      'Created at', 'Updated at']

     csv_data = FasterCSV.generate do |csv|
        csv << headers
        @earls.each do |e|
           csv << [ e.id, e.name, e.question_id, e.user_id, e.active, !e.logo_file_name.nil?, ! (e.pass.nil? || e.pass.empty?),
                   e.created_at, e.updated_at]
  	end
     end
    send_data(csv_data,
        :type => 'text/csv; charset=iso-8859-1; header=present',
        :disposition => "attachment; filename=#{outfile}")
  end
  
  
  protected

  def dumb_cleartext_authentication
    @earl = Earl.find(params[:id])
    redirect_to('/') and return unless @earl
    unless @earl.pass.blank?
      authenticate_or_request_with_http_basic(t('questions.owner_password_exp')) do |user_name, password|
        (user_name == @earl.name) && (password == @earl.pass)
      end
    end
  end
  
end

# @question = Question.find_by_name(params[:id]) #the question has a prompt id with it
#  #logger.info "inside questions#show " + Question.find(@question.id).inspect
#  @prompt = Prompt.find(@question.attributes['picked_prompt_id'], :params => {:question_id => @question.id})
#  session[:current_prompt_id] = @question.attributes['picked_prompt_id']
#  #@items = @question.items
#  @right_choice_text = @prompt.right_choice_text
#  @left_choice_text = @prompt.left_choice_text
#  @item_count = @question.attributes['item_count']
#  @votes_count = @question.attributes['votes_count']
