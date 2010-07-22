class EarlsController < ApplicationController
  #caches_page :show
  include ActionView::Helpers::TextHelper
  require 'fastercsv'
  
  
  before_filter :dumb_cleartext_authentication, :except => :export_list

  def show
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    session[:on_example] = (params[:id] == 'studentgovernment')
    session[:welcome_msg] = @earl.welcome_message.blank? ? nil: @earl.welcome_message
    
    if @earl
      unless @earl.active?
        flash[:notice] = t('questions.not_active_error')
        redirect_to '/' and return
      end

      if params[:locale].nil? && @earl.default_lang != I18n.default_locale.to_s
	      I18n.locale = @earl.default_lang

	      redirect_to :action => :show, :controller => :earls, :id => @earl.name and return
      end

      begin
      
      show_params = {:with_prompt => true, 
		     :with_appearance => true, 
		     :with_visitor_stats => true,
		     :visitor_identifier => request.session_options[:id]}

      show_params.merge!(:future_prompts => {:number => 1}) if @photocracy

      @question = Question.find(@earl.question_id, :params => show_params)

      #reimplement in some way
      rescue ActiveResource::ResourceConflict
        flash[:error] = "This idea marketplace does not have enough active #{@photocracy ? 'photos' : 'ideas'}. Please contact the owner of this marketplace to resolve this situation"
        redirect_to "/" and return
      end


       logger.info "inside questions#show " + @question.inspect

       # we can probably make this into one api call
       @prompt = Prompt.find(@question.attributes['picked_prompt_id'], :params => {:question_id => @question.id})

       @right_choice_text = @prompt.right_choice_text
       @left_choice_text = @prompt.left_choice_text
       @left_choice_id = @prompt.left_choice_id
       @right_choice_id = @prompt.right_choice_id

       if @photocracy
          @vote_crossfade_transition = ab_test("vote_crossfade_transition", nil, :conversion => "voted")
          # @vote_crossfade_transition = true
          @right_choice_photo = Photo.find(@right_choice_text)
          @left_choice_photo = Photo.find(@left_choice_text)
          @future_right_choice_photo = Photo.find(@question.attributes['future_right_choice_text_1'])
          @future_left_choice_photo = Photo.find(@question.attributes['future_left_choice_text_1'])
       end

       if @widget
         if (width = params[:width]) && (height = params[:height]) 
           if @@widget_supported_sizes.include?("#{width}x#{height}")    
              @widget_stylesheet = "widget/screen_#{width}_#{height}"
	   else
	    render :text => "This is not a supported size. Currently supported: 450x410" and return
	   end
         else
	  render :text => "You must specify a size when requesting a widget. Add ?width=450&height=410 to your url" and return
         end
       end
       
       @ab_test_name = (params[:id] == 'studentgovernment') ? "studgov_test_size_of_X_votes_on_Y_ideas2" : 
       								"#{@earl.name}_#{@earl.question_id}_test_size_of_X_votes_on_Y_ideas"	       
       @ab_test_ideas_text_name = "#{@earl.name}_#{@earl.question_id}_test_contents_of_add_idea_button"	       
       @ab_test_stackoverflow_name = "#{@earl.name}_#{@earl.question_id}_test_stackoverflow_welcome"	       
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
