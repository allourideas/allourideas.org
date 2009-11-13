class EarlsController < ApplicationController
  def show
    @earl = Earl.find(:first, :conditions => {:name => params[:id]})
    #redirect_to(@earl ? @earl.question : '/' ) and return
    if @earl
      @question = @earl.question#the question has a prompt id with it
       logger.info "inside questions#show " + @question.inspect
       @prompt = Prompt.find(@question.attributes['picked_prompt_id'], :params => {:question_id => @question.id})
       session[:current_prompt_id] = @question.attributes['picked_prompt_id']
       @items = @question.items
       @right_choice_text = @prompt.right_choice_text
       @left_choice_text = @prompt.left_choice_text
      # # logger.info "redirecting"
      # # 
      render :controller => "Questions", :action => "show"
    else
      redirect_to('/') and return
    end
  end
end