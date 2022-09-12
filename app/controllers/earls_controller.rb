class EarlsController < ApplicationController
  #caches_page :show
  include ActionView::Helpers::TextHelper
  include ActionView::Helpers::AssetTagHelper
  before_action :dumb_cleartext_authentication, :except => :export_list

  def verify
    if @earl.verify!(params[:code])
      flash[:notice] = t('admin.wiki_survey_verification_succeeded')
      redirect_to earl_url(:id => @earl.name) and return
    else
      flash[:error] = t('admin.wiki_survey_verification_failed')
      redirect_to '/' and return
    end
  end

  def show
    session[:welcome_msg] = @earl.welcome_message.blank? ? nil: @earl.welcome_message

    if @earl
      unless @earl.allows_voting?
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
		     :visitor_identifier => @survey_session.session_id}

      show_params.merge!({:future_prompts => {:number => 1}, :with_average_votes => true}) if @photocracy

      @question = Question.find(@earl.question_id, :params => show_params)

      #reimplement in some way
      rescue ActiveResource::ResourceConflict
        flash[:error] = "This wiki survey does not have enough active #{@photocracy ? 'photos' : 'ideas'}. Please contact the owner of this survey to resolve this situation"
        redirect_to "/" and return
      end


        @survey_session.appearance_lookup = @question.attributes["appearance_id"]
       logger.info "inside questions#show " + @question.inspect

       # we can probably make this into one api call
       @prompt = Prompt.find(@question.attributes['picked_prompt_id'], :params => {:question_id => @question.id})

       @right_choice_text = @prompt.right_choice_text
       @left_choice_text = @prompt.left_choice_text
       @left_choice_id = @prompt.left_choice_id
       @right_choice_id = @prompt.right_choice_id

       if @photocracy
          @vote_crossfade_transition = true
          @crossfade_time = '250'
          @show_average_votes = false

          @right_choice_photo = Photo.find(@right_choice_text)
          @left_choice_photo = Photo.find(@left_choice_text)
          @future_right_choice_photo = Photo.find(@question.attributes['future_right_choice_text_1'])
          @future_left_choice_photo = Photo.find(@question.attributes['future_left_choice_text_1'])
       end

       if @widget
         # Define these here because of bug with ie6 css when color parameters are not defined
         @text_on_white = "#555555"
         @lighter_text_on_white = "#797979"
         @vote_button_hover_color = "#2B88AD"
         @tab_hover_color = "#A3D4E8"
         @flag_text_color = "#54AFE2"
         @vote_button_color = "#3198c1"
         @submit_button_color = "#01bb00"
         @submit_button_hover_color = "#228b53"
         @cant_decide_button_color = "#C5C5C5"
         @submit_button_hover_color = "#B1B1B1"
         @add_idea_button_color = "#01bb00"
         @add_idea_button_hover_color = "#228b53"
         @question_text_color = "#000000"
         @text_on_color = "#FFFFFF"

         if (text_on_white = validate_hex_color(params[:text_on_white]))
           lighter_text = alter_color(text_on_white, 1.1)
           @text_on_white = "##{text_on_white}"
           @lighter_text_on_white = "##{lighter_text}"
	       end

         if (vote_button = validate_hex_color(params[:vote_button]))
           vote_button_hover = alter_color(vote_button, 0.8)
           @vote_button_color = "##{vote_button}"
           @vote_button_hover_color = "##{vote_button_hover}"
	       end

         if (tab_hover = validate_hex_color(params[:tab_hover]))
           @tab_hover_color = "##{tab_hover}"
         end

         if (flag_text = validate_hex_color(params[:flag_text]))
           @flag_text_color = "##{flag_text}"
	       end

         if (submit_button = validate_hex_color(params[:submit_button]))
           submit_button_hover = alter_color(submit_button, 0.8)
           @submit_button_color = "##{submit_button}"
           @submit_button_hover_color = "##{submit_button_hover}"
	       end

         if (cant_decide_button = validate_hex_color(params[:cant_decide_button]))
           cant_decide_button_hover = alter_color(cant_decide_button, 0.8)
           @cant_decide_button_color = "##{cant_decide_button}"
           @cant_decide_button_hover_color = "##{cant_decide_button_hover}"
	       end

         if (add_idea_button = validate_hex_color(params[:add_idea_button]))
           add_idea_button_hover = alter_color(add_idea_button, 0.8)
           @add_idea_button_color = "##{add_idea_button}"
           @add_idea_button_hover_color = "##{add_idea_button_hover}"
	       end

         if (question_text = validate_hex_color(params[:question_text]))
           @question_text_color = "##{question_text}"
	       end

         if (text_on_color = validate_hex_color(params[:text_on_color]))
           @text_on_color = "##{text_on_color}"
         end

       end

      if wikipedia?
        # wikipedia ideas are prepended by a 4 character integer
        # that represents their image id
        @left_image_id = @left_choice_text.split('-',2)[0]
        @right_image_id = @right_choice_text.split('-',2)[0]
        @left_choice_text = @left_choice_text.split('-',2)[1]
        @right_choice_text = @right_choice_text.split('-',2)[1]
        @images = {}
        image_dir = "public/images/wikipedia/ad/"
        fullsize_image_paths = Dir.glob("#{image_dir}[0-9][0-9][0-9][0-9].png").map{|i| i.sub(/^public/, '') }
        thumbnail_image_paths = Dir.glob("#{image_dir}[0-9][0-9][0-9][0-9]-thumb.png").map{|i| i.sub(/^public/, '') }
        @fullsize_images = {}
        fullsize_image_paths.each do |image|
          @fullsize_images[File.basename(image, '.png')] = image_path(image)
        end
        @thumbnail_images = {}
        thumbnail_image_paths.each do |image|
          @thumbnail_images[File.basename(image, '-thumb.png')] = image_path(image)
        end


        render(:template => 'wikipedia/earls_show', :layout => '/wikipedia/layout') && return
      end
    else
      redirect_to('/') and return
    end
  end

  # Perhaps this function should be moved somewhere else?
  # Darkens or lightens "color" (hex string) by a factor of "amount"
  def alter_color(color, amount)
    # Parse hex color, convert to int, multiply by amount, convert back to hex, prepend any necessary 0's, concatenate to reform color
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

     csv_data = CSVBridge.generate do |csv|
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

  def validate_hex_color(color)
    return false unless color.class == String
    color.strip!
    color.tr!('#', '')
    return color if /^[a-fA-F0-9]{6}$/.match(color)
    if /^[a-fA-F0-9]{3}$/.match(color)
      return color[0,1] + color[0,1] + color[1,1] + color[1,1] + color[2,1] + color[2,1]
    end
    return false
  end

  def dumb_cleartext_authentication
    redirect_to('/') and return unless @earl
    unless @earl.pass.blank?
      authenticate_or_request_with_http_basic(t('questions.owner_password_exp')) do |user_name, password|
        (user_name == @earl.name) && (password == @earl.pass)
      end
    end
  end
end
