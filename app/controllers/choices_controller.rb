class ChoicesController < ApplicationController
  include ActionView::Helpers::TextHelper
  before_filter :authenticate, :only => [:toggle]

  def show
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    @question_id = Question.find_id_by_name(params[:question_id])
    @earl = Earl.find params[:question_id]
    
    if params[:locale].nil? && @earl.default_lang != I18n.default_locale.to_s
	      I18n.locale = @earl.default_lang
	      redirect_to :action => :show, :controller => :choices, 
		      :question_id => params[:question_id], :id => params[:id]  and return
    end
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
    @earl = Earl.find(params[:earl_id])
    unless (current_user.owns?(@earl) || current_user.admin?)
      render(:json => {:message => t('items.toggle_error')}.to_json) and return
    end
    @choice = Choice.find(params[:id], :params => {:question_id => @earl.question_id})
    @choice.active = !@choice.active
    
    verb = {true => t('items.list.activated'), false => t('items.list.deactivated')}
    
    respond_to do |format|
        format.xml  {  head :ok }
        format.js  { 
          
        if @choice.save
          render :json => {:verb => verb[@choice.active?], :active => @choice.active?}.to_json
        else
          render :json => {:verb => verb[!@choice.active?], :active => !@choice.active?}.to_json
        end
        }
    end
  end
  
  
  def activate
    authenticate 
    if !current_user
    	flash[:notice] = t('user.deny_access_error')
	return
    end
    
    @question = Question.find_by_name(params[:question_id])
    logger.info "actual question ID is #{@question.id}"
    @choice = Choice.find(params[:id], :params => {:question_id => @question.id})
    logger.info "Found choice: #{@choice.inspect}"
    #@choice.activate! if @choice
    
    if current_user == @question.creator
    
    	@choice.put(:update_from_abroad, :params => {:question_id => @question.id}) if @choice
    	flash[:notice] = t('items.you_have_successfully_activated') + " '#{@choice.attributes['data']}'"
    	logger.info flash[:notice]
    	# redirect_to("#{@question.earl}/choices/#{@choice.id}") and return
    	redirect_to("#{@question.earl}") and return
    else
    	flash[:notice] = t('user.not_authorized_error')
	redirect_to('/sign_in') and return
    end
  end
  
  
  def deactivate
    authenticate 
    if !current_user
    	flash[:notice] = t('user.deny_access_error')
	return
    end

    @question = Question.find_by_name(params[:question_id])
    logger.info "actual question ID is #{@question.id}"
    @choice = Choice.find(params[:id], :params => {:question_id => @question.id})
    logger.info "Found choice: #{@choice.inspect}"

    # should probably put an error message for those not logged in 
    if current_user == @question.creator
    	@choice.put(:deactivate_from_abroad, :params => {:question_id => @question.id}) if @choice
    	flash[:notice] = t('items.you_have_successfully_deactivated') + " '#{@choice.attributes['data']}'"
    	logger.info flash[:notice]
    	# redirect_to("#{@question.earl}/choices/#{@choice.id}") and return
    	redirect_to("#{@question.earl}") and return
    else
    	flash[:notice] = t('user.not_authorized_error')
	redirect_to('/sign_in') and return
    end
  end
  
  
end
