class PromptsController < ApplicationController
  include ActionView::Helpers::TextHelper

  def vote
    bingo!("voted")
    voted_prompt = Prompt.find(params[:id], :params => {:question_id => params[:question_id]})
    session[:has_voted] = true

    @earl = Earl.find_by_question_id(params[:question_id])
    if params[:direction] &&
      vote = voted_prompt.post(:vote,
        :question_id => params[:question_id],
          :vote => get_object_request_options(params, :vote),
          :next_prompt => get_next_prompt_options
        
      )

      next_prompt = Crack::XML.parse(vote.body)['prompt']

      ab_test_name = get_leveling_feedback_abtest_name

      leveling_message = Visitor.leveling_message(:votes => next_prompt['visitor_votes'].to_i,
					          :ideas => next_prompt['visitor_ideas'].to_i, :ab_test_name => ab_test_name)

      result = {
        :newleft           => CGI::escapeHTML(truncate(next_prompt['left_choice_text'], :length => 140, :omission => '…')),
        :newright          => CGI::escapeHTML(truncate(next_prompt['right_choice_text'], :length => 140, :omission => '…')),
        :left_choice_id    => next_prompt['left_choice_id'],
        :left_choice_url   => question_choice_path(@earl.name, next_prompt['left_choice_id']),
        :right_choice_id   => next_prompt['right_choice_id'],
        :right_choice_url  => question_choice_path(@earl.name, next_prompt['right_choice_id']),
        :appearance_lookup => next_prompt['appearance_id'],
        :prompt_id         => next_prompt['id'],
        :leveling_message  => leveling_message,
      }

      if wikipedia?
        # wikipedia ideas are prepended by a 4 character integer
        # that represents their image id
        result[:left_image_id] = CGI::escapeHTML(next_prompt['left_choice_text'].split('-',2)[0])
        result[:right_image_id] = CGI::escapeHTML(next_prompt['right_choice_text'].split('-',2)[0])
        result[:newleft] = CGI::escapeHTML(truncate(next_prompt['left_choice_text'].split('-',2)[1], :length => 140, :omission => '…')).gsub("\n","<br />")
        result[:newright] = CGI::escapeHTML(truncate(next_prompt['right_choice_text'].split('-',2)[1], :length => 140, :omission => '…')).gsub("\n","<br />")
      end

      result = add_photocracy_info(result, next_prompt, params[:question_id]) if @photocracy
      render :json => result.to_json
    else
      render :text => 'Vote unsuccessful.', :status => :unprocessable_entity
    end
  end

  def skip
    prompt_id = params[:id]
    question_id = params[:question_id]

    logger.info "Getting ready to skip out on Prompt #{prompt_id}, Question #{params[:id]}"
    @prompt = Prompt.find(prompt_id, :params => {:question_id => params[:question_id]})
    
    @earl = Earl.find_by_question_id(params[:question_id])
    if skip = @prompt.post(:skip, :question_id => question_id,
                           :skip => get_object_request_options(params, :skip),
                           :next_prompt => get_next_prompt_options)
      next_prompt = Crack::XML.parse(skip.body)['prompt']
      
      ab_test_name = get_leveling_feedback_abtest_name
      leveling_message = Visitor.leveling_message(:votes => next_prompt['visitor_votes'].to_i,
					          :ideas => next_prompt['visitor_ideas'].to_i, :ab_test_name => ab_test_name)

      result = {
        :newleft           => CGI::escapeHTML(truncate(next_prompt['left_choice_text'], :length => 140, :omission => '…')),
        :newright          => CGI::escapeHTML(truncate(next_prompt['right_choice_text'], :length => 140, :omission => '…')),
        :appearance_lookup => next_prompt['appearance_id'],
        :prompt_id         => next_prompt['id'],
        :left_choice_id    => next_prompt['left_choice_id'],
        :left_choice_url   => question_choice_path(@earl.name, next_prompt['left_choice_id']),
        :right_choice_id   => next_prompt['right_choice_id'],
        :right_choice_url  => question_choice_path(@earl.name, next_prompt['right_choice_id']),
        :leveling_message  => leveling_message,
        :message => t('vote.cant_decide_message')
      }

      if wikipedia?
        # wikipedia ideas are prepended by a 4 character integer
        # that represents their image id
        result[:left_image_id] = CGI::escapeHTML(next_prompt['left_choice_text'].split('-',2)[0])
        result[:right_image_id] = CGI::escapeHTML(next_prompt['right_choice_text'].split('-',2)[0])
        result[:newleft] = CGI::escapeHTML(truncate(next_prompt['left_choice_text'].split('-',2)[1], :length => 140, :omission => '…')).gsub("\n","<br />")
        result[:newright] = CGI::escapeHTML(truncate(next_prompt['right_choice_text'].split('-',2)[1], :length => 140, :omission => '…')).gsub("\n","<br />")
      end

      result = add_photocracy_info(result, next_prompt, params[:question_id]) if @photocracy
      render :json => result.to_json
    else
      render :json => '{"error" : "Skip failed"}'
    end
  end

  def flag
    prompt_id = params[:id]
    reason = params[:flag_reason]
    inappropriate_side = params[:side]
    question_id = params[:question_id]
    @earl = Earl.find_by_question_id(question_id)

    @prompt = Prompt.find(prompt_id, :params => {:question_id => question_id})
    choice_id = inappropriate_side == "left_flag" ? @prompt.left_choice_id : @prompt.right_choice_id 

    @choice = Choice.new
    @choice.id = choice_id
    @choice.prefix_options[:question_id] = question_id

    c = @choice.put(:flag,
                    :visitor_identifier => request.session_options[:id],
                    :explanation => reason)

    new_choice = Crack::XML.parse(c.body)['choice']
    flag_choice_success = (c.code == "201" && new_choice['active'] == false)
    IdeaMailer.delay.deliver_flag_notification(@earl, new_choice["id"], new_choice["data"], reason, @photocracy)

    begin
      skip = @prompt.post(:skip, :question_id => question_id,
                          :skip => get_object_request_options(params, :skip_after_flag),
                          :next_prompt => get_next_prompt_options
                          )
    rescue ActiveResource::ResourceConflict
      skip = nil
      flash[:error] = "You flagged an idea as inappropriate. We have deactivated this idea temporarily and sent a notification to the idea marketplace owner. Currently, this idea marketplace does not have enough active ideas. Please contact the owner of this marketplace to resolve this situation"
    end

    if flag_choice_success && skip
      next_prompt = Crack::XML.parse(skip.body)['prompt']
      
      ab_test_name = get_leveling_feedback_abtest_name
      leveling_message = Visitor.leveling_message(:votes => next_prompt['visitor_votes'].to_i,
					          :ideas => next_prompt['visitor_ideas'].to_i, :ab_test_name => ab_test_name)

      result = {
        :newleft           => CGI::escapeHTML(truncate(next_prompt['left_choice_text'], :length => 140, :omission => '…')),
        :newright          => CGI::escapeHTML(truncate(next_prompt['right_choice_text'], :length => 140, :omission => '…')),
        :appearance_lookup => next_prompt['appearance_id'],
        :left_choice_id    => next_prompt['left_choice_id'],
        :left_choice_url   => question_choice_path(@earl.name, next_prompt['left_choice_id']),
        :right_choice_id   => next_prompt['right_choice_id'],
        :right_choice_url  => question_choice_path(@earl.name, next_prompt['right_choice_id']),
        :prompt_id         => next_prompt['id'],
        :leveling_message  => leveling_message,
        :message => t('vote.flag_complete_message')
      }

      result = add_photocracy_info(result, next_prompt, params[:question_id]) if @photocracy
      render :json => result.to_json
    else
      render :json => {:error => "Flag of choice failed",
      :redirect => url_for(:controller => :home, :action => :index )}.to_json
    end
  end

  def load_wikipedia_marketplace
    result = switch_wikipedia_marketplace(params[:question_id])
    render :json => result.to_json
  end

  private
  def add_photocracy_info(result, next_prompt, question_id)
    newright_photo     = Photo.find(next_prompt['right_choice_text'])
    newleft_photo      = Photo.find(next_prompt['left_choice_text'])
    future_left_photo  = Photo.find(next_prompt['future_left_choice_text_1'])
    future_right_photo = Photo.find(next_prompt['future_right_choice_text_1'])

    result.merge!({
      :visitor_votes        => next_prompt['visitor_votes'],
      :newright_photo       => newright_photo.image.url(:medium),
      :newright_photo_thumb => newright_photo.image.url(:thumb),
      :newleft_photo        => newleft_photo.image.url(:medium),
      :newleft_photo_thumb  => newleft_photo.image.url(:thumb),
      :future_left_photo    => future_left_photo.image.url(:medium),
      :future_right_photo   => future_right_photo.image.url(:medium),
      :newleft_url          => vote_question_prompt_url(question_id, next_prompt['id'], :direction => :left),
      :newright_url         => vote_question_prompt_url(question_id, next_prompt['id'], :direction => :right),
      :newleft_choice_url   => question_choice_url(@earl.name, next_prompt['left_choice_id']), 
      :newright_choice_url  => question_choice_url(@earl.name, next_prompt['right_choice_id']),
      :flag_url             => flag_question_prompt_url(question_id, next_prompt['id'], :format => :js),
      :skip_url             => skip_question_prompt_url(question_id, next_prompt['id'], :format => :js),
      :voted_at             => Time.now.getutc.iso8601,
      :voted_prompt_winner  => params[:direction]
    })
  end

  def get_object_request_options(params, request_type)
     options = { :visitor_identifier => request.session_options[:id],
                 # use static value of 5 if in test, so we can mock resulting API queries
                 :time_viewed => (Rails.env == 'test') ? 5 : params[:time_viewed],
                 :appearance_lookup => params[:appearance_lookup]
     }
     case request_type
       when :vote
           options.merge!({:direction => params[:direction],
		     :skip_fraud_protection => true,
                     :tracking => {:x_click_offset => params[:x_click_offset],
                                   :y_click_offset => params[:y_click_offset]}
	       })
       when :skip
	   options.merge!(:skip_reason => params[:cant_decide_reason])
       when :skip_after_flag
	   options.merge!(:skip_reason => params[:flag_reason])
 
     end

      if wikipedia?
        options.merge!({:force_invalid_vote => true})
      end
     options
  end

  def get_next_prompt_options
    next_prompt_params = { :with_appearance => true,
                            :with_visitor_stats => true,
                            :visitor_identifier => request.session_options[:id]
                          }
    next_prompt_params.merge!(:future_prompts => {:number => 1}) if @photocracy
    next_prompt_params
  end
      
  def get_leveling_feedback_abtest_name
      if !@photocracy
         ab_test_name = "#{@earl.name}_#{@earl.question_id}_leveling_feedback_with_5_treatments"
      else
	 ab_test_name = nil
      end
      ab_test_name
  end
end
