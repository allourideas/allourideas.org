class EarlsController < ApplicationController
  #caches_page :show
  include ActionView::Helpers::TextHelper
  require 'fastercsv'
  
  
  before_filter :dumb_cleartext_authentication, :except => :export_list
  
  def show
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    session[:on_example] = (params[:id] == 'studentgovernment')
    
    if @earl
      unless @earl.active?
        flash[:notice] = "Sorry, that question is not active."
        redirect_to '/' and return
      end
      @question = @earl.question#the question has a prompt id with it
       logger.info "inside questions#show " + @question.inspect
       @prompt = Prompt.find(@question.attributes['picked_prompt_id'], :params => {:question_id => @question.id})
       session[:current_prompt_id] = @question.attributes['picked_prompt_id']
       #@items = @question.items
       @right_choice_text = @prompt.right_choice_text
       @left_choice_text = @prompt.left_choice_text
       @left_choice_id = @prompt.left_choice_id
       @right_choice_id = @prompt.right_choice_id
       
       @item_count = @question.attributes['item_count']
       @votes_count = @question.attributes['votes_count']

       @ab_test_name = (params[:id] == 'studentgovernment') ? "studgov_test_size_of_X_votes_on_Y_ideas2" : 
	       							"non_studgov_test_size_of_X_votes_on_Y_ideas"
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
      authenticate_or_request_with_http_basic("The owner of this question has required authentication") do |user_name, password|
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
