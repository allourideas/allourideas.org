class ChoicesController < ApplicationController
  include ActionView::Helpers::TextHelper
  def show
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    @earl = Earl.find params[:question_id]
    @question = Question.find(@earl.question_id)
    
    if params[:locale].nil? && @earl.default_lang != I18n.default_locale.to_s
	      I18n.locale = @earl.default_lang
	      redirect_to :action => :show, :controller => :choices, 
		      :question_id => params[:question_id], :id => params[:id]  and return
    end
    @choice = Choice.find(params[:id], :params => {:question_id => @question.id})
    if @choice
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
    @question = @earl.question(true)
    @choice = Choice.find(params[:id], :params => {:question_id => @question.id})
    unless (current_user.owns?(@earl) || current_user.admin?)
      render(:json => {:message => t('items.toggle_error')}.to_json) and return
    end
    @old_status = @choice.active?
    logger.info "Getting ready to change active status of Choice #{params[:id]} to #{!@old_status}"
    
    respond_to do |format|
        format.xml  {  head :ok }
        format.js  { 
          verb = @choice.active? ? t('items.list.deactivated') : t('items.list.activated')
          failed_verb = @choice.active? ? t('items.list.activated') : t('items.list.deactivated')
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
