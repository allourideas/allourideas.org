# encoding: utf-8
class PromptsController < ApplicationController
  include ActionView::Helpers::TextHelper

  def vote
    session[:has_voted] = true
    service = PromptService.new(params: params, survey_session: @survey_session, photocracy: @photocracy, current_user: current_user)

    if service.vote
      render :json => service.result.to_json
    else
      render :text => 'Vote unsuccessful.', :status => :unprocessable_entity
    end
  end

  def skip
    logger.info "Getting ready to skip out on Prompt #{params[:id]}, Question #{params[:question_id]}"
    service = PromptService.new(params: params, survey_session: @survey_session, photocracy: @photocracy, current_user: current_user)

    if service.skip
      render :json => service.result.to_json
    else
      render :json => '{"error" : "Skip failed"}'
    end
  end

  def flag
    service = PromptService.new(params: params, survey_session: @survey_session, photocracy: @photocracy, current_user: current_user)
    flag_result = service.flag
    unless flag_result
      flash[:error] = "You flagged an idea as inappropriate. We have deactivated this idea temporarily and sent a notification to the wiki survey owner. Currently, this wiki survey does not have enough active ideas. Please contact the owner of this survey to resolve this situation"
    end

    if flag_result
      render :json => service.result.to_json
    else
      render :json => {:error => "Flag of choice failed",
      :redirect => url_for(:controller => :home, :action => :index )}.to_json
    end
  end

  def load_wikipedia_marketplace
    result = switch_wikipedia_marketplace(params[:question_id])
    render :json => result.to_json
  end

end
