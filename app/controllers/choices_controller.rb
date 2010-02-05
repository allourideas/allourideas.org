class ChoicesController < ApplicationController
  include ActionView::Helpers::TextHelper
  def show
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    @question_id = Question.find_id_by_name(params[:question_id])
    @earl = Earl.find params[:question_id]
    @choice = Choice.find(params[:id], :params => {:question_id => @question_id})
    if @choice
      @question_name = @choice.attributes['question_name']
      @data = @choice.attributes['data']
      @score = @choice.attributes['score'].round rescue (@score = 0)
      logger.info "the score is #{@score.inspect}"
      @created_at = @choice.attributes['created_at']
      @votes_count = @choice.attributes['wins_plus_losses']
      respond_to do |format|
        format.html # show.html.erb
      end
    else
      redirect_to('/') and return
    end
  end
  
  def toggle
    authenticate
    @earl = Earl.find(params[:earl_id])
    @question = @earl.question
    @choice = Choice.find(params[:id], :params => {:question_id => @question.id})
    unless current_user.owns? @earl
      render(:json => {:message => "Sorry, we could not change the status of this choice because you do not own the question."}.to_json) and return
    end
    @old_status = @choice.active?
    logger.info "Getting ready to change active status of Choice #{params[:id]} to #{!@old_status}"
    
    respond_to do |format|
        format.xml  {  head :ok }
        format.js  { 
          verb = @choice.active? ? 'Deactivated' : 'Activated'
          failed_verb = @choice.active? ? 'Activated' : 'Deactivated'
          remote_function = @choice.active? ? :deactivate_from_abroad : :update_from_abroad
          
          begin
            if @choice.put(remote_function, :params => {:question_id => @question.id})
              logger.info "just #{verb} choice"
              render :json => {:message => "You've just #{verb.downcase} this choice", :verb => verb}.to_json
            else
              render :json => {:message => "Sorry, could not toggle status of choice", :verb => verb}.to_json
            end
          rescue
            render :json => {:message => "Sorry, could not toggle status of choice. Remember that you need at least two active choices.", :verb => failed_verb, :error => true}.to_json
          end
        }
    end
  end
  
  
  def activate
    authenticate 
    if !current_user
    	flash[:notice] = "You must be logged in to perform this action"
	return
    end
    
    @question = Question.find_by_name(params[:question_id])
    logger.info "actual question ID is #{@question.id}"
    @choice = Choice.find(params[:id], :params => {:question_id => @question.id})
    logger.info "Found choice: #{@choice.inspect}"
    #@choice.activate! if @choice
    
    redirect_to('/') and return unless current_user == @question.creator
    if current_user == @question.creator
    
    	@choice.put(:update_from_abroad, :params => {:question_id => @question.id}) if @choice
    	flash[:notice] = "You have successfully activated the idea '#{@choice.attributes['data']}'"
    	logger.info flash[:notice]
    	# redirect_to("#{@question.earl}/choices/#{@choice.id}") and return
    	redirect_to("#{@question.earl}") and return
    else
    	flash[:notice] = "You do not have permission to modify this question"
	redirect_to('/sign_in') and return
    end
  end
  
  
  def deactivate
    authenticate 
    if !current_user
    	flash[:notice] = "You must be logged in to perform this action"
	return
    end

    @question = Question.find_by_name(params[:question_id])
    logger.info "actual question ID is #{@question.id}"
    @choice = Choice.find(params[:id], :params => {:question_id => @question.id})
    logger.info "Found choice: #{@choice.inspect}"

    # should probably put an error message for those not logged in 
    if current_user == @question.creator
    	@choice.put(:deactivate_from_abroad, :params => {:question_id => @question.id}) if @choice
    	flash[:notice] = "You have successfully deactivated the idea '#{@choice.attributes['data']}'"
    	logger.info flash[:notice]
    	# redirect_to("#{@question.earl}/choices/#{@choice.id}") and return
    	redirect_to("#{@question.earl}") and return
    else
    	flash[:notice] = "You do not have permission to modify this question"
	redirect_to('/sign_in') and return
    end
  end
  
  
end
