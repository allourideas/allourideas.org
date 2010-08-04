class EarlsController < ApplicationController
  #caches_page :show
  include ActionView::Helpers::TextHelper
  require 'fastercsv'
  
  
  before_filter :dumb_cleartext_authentication, :except => :export_list

  def show
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
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

      show_params.merge!({:future_prompts => {:number => 1}, :with_average_votes => true}) if @photocracy

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
          if params[:crossfade]
            @vote_crossfade_transition = eval(params[:crossfade]) rescue true
          else
            @vote_crossfade_transition = ab_test("#{@earl.name}_#{@earl.question_id}_vote_crossfade_transition", nil, :conversion => "voted")
          end
          @right_choice_photo = Photo.find(@right_choice_text)
          @left_choice_photo = Photo.find(@left_choice_text)
          @future_right_choice_photo = Photo.find(@question.attributes['future_right_choice_text_1'])
          @future_left_choice_photo = Photo.find(@question.attributes['future_left_choice_text_1'])
       end

       if @widget    
         @widget_stylesheet = "widget/screen"

         if (text = params[:text])
           lighter = alter_color(text, 1.1);
           @text_color = "##{text}"  
           @lighter_text_color = "##{lighter}" 
	       end

         if (button = params[:button])
           vote_hover = alter_color(button, 0.8)
           @vote_button_color = "##{button}"          
           @vote_hover_color = "##{vote_hover}"
	       end

         if (tab_hover = params[:tab_hover])
           @tab_hover_color = "##{tab_hover}"
         end

         if (flag = params[:flag])
           @flag_color = "##{flag}"    
	       end

         if (submit = params[:submit])
           submit_hover = alter_color(submit, 0.8)
           @submit_color = "##{submit}"  
           @submit_hover_color = "##{submit_hover}"  
	       end

         if (cd = params[:cd])
           cd_hover = alter_color(cd, 0.8)
           @cd_color = "##{cd}"  
           @cd_hover_color = "##{cd_hover}"  
	       end

         if (add = params[:add])
           add_hover = alter_color(add, 0.8)
           @add_color = "##{add}"  
           @add_hover_color = "##{add_hover}"  
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

  # Perhaps this function should be moved somewhere else?
  # Darkens or lightens color by amount
  def alter_color(color, amount)
    # Parse hex color, convert to int, add amount, convert back to hex, concatenate to reform color
     r = color[0..1].to_i(16) * amount
     g = color[2..3].to_i(16) * amount
     b = color[4..5].to_i(16) * amount

     if (r < 0)
      r = 0;
     elsif (r > 255)
      r = 255;
     end
     if (g < 0)
      g = 0;
     elsif (g > 255)
      g = 255; 
     end
     if (b < 0)
      b = 0;
     elsif (b > 255)
      b = 255;   
     end

     return r.floor.to_s(16).rjust(2, '0') + g.floor.to_s(16).rjust(2, '0') + b.floor.to_s(16).rjust(2, '0')
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
