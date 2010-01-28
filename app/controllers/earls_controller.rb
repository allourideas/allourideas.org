class EarlsController < ApplicationController
  #caches_page :show
  include ActionView::Helpers::TextHelper
  
  
  before_filter :dumb_cleartext_authentication
  
  def show
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    session[:on_example] = (params[:id] == 'studentgovernment')
    
    if @earl
      unless @earl.active?
        flash[:for_real] = "Sorry, this question is not active."
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
      # # logger.info "redirecting"
      # # 
      render :controller => "Questions", :action => "show"
    else
      redirect_to('/') and return
    end
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