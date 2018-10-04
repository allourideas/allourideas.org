class PromptService
  include Rails.application.routes.url_helpers

  attr_reader :params, :survey_session, :photocracy, :current_user, :earl,
    :result, :next_prompt, :flag_choice_success

  def initialize(params:, survey_session:, photocracy:, current_user:)
    @params = params
    @survey_session = survey_session
    @photocracy = photocracy
    @current_user = current_user
  end

  def vote
    @earl = Earl.find_by_question_id(params[:question_id].to_s)
    voted_prompt = Prompt.new
    voted_prompt.id = params[:id]
    voted_prompt.prefix_options = {:question_id => params[:question_id]}

    if params[:direction] &&
      vote = voted_prompt.put(:vote,
        :question_id => params[:question_id],
          :vote => get_object_request_options(params, :vote),
          :next_prompt => get_next_prompt_options

      )
      set_result(vote)
      add_wikipeia
      true
    else
      false
    end
  end

  def skip
    @earl = Earl.find_by_question_id(params[:question_id].to_s)
    prompt_id = params[:id]
    question_id = params[:question_id]
    prompt = Prompt.find(prompt_id, :params => {:question_id => params[:question_id]})

    if skip = prompt.post(:skip, :question_id => question_id,
                           :skip => get_object_request_options(params, :skip),
                           :next_prompt => get_next_prompt_options)
      set_result(skip)
      result[:message] = I18n.t('vote.cant_decide_message')
      add_wikipeia
      true
    else
      false
    end
  end

  def flag
    prompt_id = params[:id]
    reason = params[:flag_reason]
    inappropriate_side = params[:side]
    question_id = params[:question_id]
    @earl = Earl.find_by_question_id(question_id.to_s)

    prompt = Prompt.find(prompt_id, :params => {:question_id => question_id})
    choice_id = inappropriate_side == "left_flag" ? prompt.left_choice_id : prompt.right_choice_id

    choice = Choice.new
    choice.id = choice_id
    choice.prefix_options[:question_id] = question_id

    c = choice.put(:flag,
                    :visitor_identifier => survey_session.session_id,
                    :explanation => reason)

    new_choice = Hash.from_xml(c.body)['choice']
    @flag_choice_success = (c.code == "201" && new_choice['active'] == false)
    IdeaMailer.delay.flag_notification(earl, new_choice["id"], new_choice["data"], reason, photocracy)

    begin
      skip = prompt.post(:skip, :question_id => question_id,
                          :skip => get_object_request_options(params, :skip_after_flag),
                          :next_prompt => get_next_prompt_options
                          )
    rescue ActiveResource::ResourceConflict
      skip = nil
    end

    if flag_choice_success && skip
      set_result(skip)
      next_prompt = Hash.from_xml(skip.body)['prompt']

      result[:message] = I18n.t('vote.flag_complete_message')
      add_photocracy_info(result, next_prompt, params[:question_id]) if photocracy
      true
    else
      false
    end
  end

  private

  def set_result(vote)
    @next_prompt = Hash.from_xml(vote.body)['prompt']

    @result = {
      :newleft           => CGI::escapeHTML(next_prompt['left_choice_text'].truncate(140, :omission => '…')),
      :newright          => CGI::escapeHTML(next_prompt['right_choice_text'].truncate(140, :omission => '…')),
      :left_choice_id    => next_prompt['left_choice_id'],
      :left_choice_url   => question_choice_path(earl.name, next_prompt['left_choice_id']),
      :right_choice_id   => next_prompt['right_choice_id'],
      :right_choice_url  => question_choice_path(earl.name, next_prompt['right_choice_id']),
      :appearance_lookup => next_prompt['appearance_id'],
      :prompt_id         => next_prompt['id'],
    }
    survey_session.appearance_lookup = result[:appearance_lookup]
    add_photocracy_info(result, next_prompt, params[:question_id]) if photocracy
    result
  end

  def add_wikipeia
    if earl.wikipedia?
      # wikipedia ideas are prepended by a 4 character integer
      # that represents their image id
      result[:left_image_id] = CGI::escapeHTML(next_prompt['left_choice_text'].split('-',2)[0])
      result[:right_image_id] = CGI::escapeHTML(next_prompt['right_choice_text'].split('-',2)[0])
      result[:newleft] = CGI::escapeHTML(next_prompt['left_choice_text'].split('-',2)[1].truncate(140, :omission => '…')).gsub("\n","<br />")
      result[:newright] = CGI::escapeHTML(next_prompt['right_choice_text'].split('-',2)[1].truncate(140, :omission => '…')).gsub("\n","<br />")
    end
  end

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
      :newleft_choice_url   => question_choice_url(earl.name, next_prompt['left_choice_id']),
      :newright_choice_url  => question_choice_url(earl.name, next_prompt['right_choice_id']),
      :flag_url             => flag_question_prompt_url(question_id, next_prompt['id'], :format => :js),
      :skip_url             => skip_question_prompt_url(question_id, next_prompt['id'], :format => :js),
      :voted_at             => Time.now.getutc.iso8601,
      :voted_prompt_winner  => params[:direction]
    })
  end

  def get_object_request_options(params, request_type)
    options = { :visitor_identifier => survey_session.session_id,
                 # use static value of 5 if in test, so we can mock resulting API queries
                 :time_viewed => (Rails.env == 'test') ? 5 : params[:time_viewed],
                 :appearance_lookup => params[:appearance_lookup]
    }
    if survey_session.old_session_id
      options.merge!({:old_visitor_identifier => survey_session.old_session_id})
    end
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

    if earl.wikipedia?
      options.merge!({:force_invalid_vote => true})
    end
    options
  end

  def get_next_prompt_options
    next_prompt_params = { :with_appearance => true,
                            :with_visitor_stats => true,
                            :visitor_identifier => survey_session.session_id
                          }
    next_prompt_params.merge!(:future_prompts => {:number => 1}) if photocracy
    next_prompt_params
  end
end
