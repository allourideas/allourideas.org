class EarlsController < ApplicationController
  #caches_page :show
  include ActionView::Helpers::TextHelper
  
  def show
    session[:on_example] = (params[:id] == 'studentgovernment')
    @earl = Earl.find(params[:id])
    if @earl
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