class ChoicesController < ApplicationController
  include ActionView::Helpers::TextHelper
  before_filter :authenticate, :only => [:toggle]
  before_filter :earl_owner_or_admin_only, :only => [:activate, :deactivate]

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
    @num_votes = @choice.wins + @choice.losses

    if @photocracy
      @photo = Photo.find(@choice.data.strip)
      @votes = @choice.get(:votes)

      if params[:login_reminder]
          unless (current_user && (current_user.owns?(@earl) || current_user.admin?))
    	      deny_access(t('user.deny_access_error')) and return
          end
      end
    end

    if @choice
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
    set_choice_active(true,  t('items.you_have_successfully_activated'))
  end
  
  
  def deactivate
    set_choice_active(false, t('items.you_have_successfully_deactivated'))
  end
  
  protected 

  def set_choice_active(value, success_message)
    @choice = Choice.find(params[:id], :params => {:question_id => @earl.question_id})
    @choice.active = value
    
    respond_to do |format|
       if @choice.save
         flash[:notice] = success_message + " '#{@choice.attributes['data']}'"
         format.html {redirect_to(:controller => :earls, :action => :show, :id => @earl.name) and return}
       else
         flash[:notice] = "There was an error, could not save choice settings"
         format.html {redirect_to(:controller => :earls, :action => :show, :id => @earl.name) and return}
       end
    end

  end
  
end
