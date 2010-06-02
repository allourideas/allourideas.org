class PromptsController < ApplicationController
  include ActionView::Helpers::TextHelper

  def vote
    bingo!("voted")
    voted_prompt = Prompt.find(params[:id], :params => {:question_id => params[:question_id]})
    session[:has_voted] = true
    
    if params[:direction] &&
      vote = voted_prompt.post("vote_#{params[:direction]}".to_sym,
        :question_id => params[:question_id],
        :params => {
          :auto => request.session_options[:id],
          :time_viewed => params[:time_viewed],
          :appearance_lookup => params[:appearance_lookup]
        }
      )

      next_prompt = Crack::XML.parse(vote.body)['prompt']
      leveling_message = Visitor.leveling_message(:votes => next_prompt['visitor_votes'].to_i,
					                                        :ideas => next_prompt['visitor_ideas'].to_i)

      result = {
        :newleft           => truncate(next_prompt['left_choice_text'], {:length => 137}),
        :newright          => truncate(next_prompt['right_choice_text'], {:length => 137}),
        :appearance_lookup => next_prompt['appearance_id'],
        :prompt_id         => next_prompt['id'],
        :leveling_message  => leveling_message,
      }

      if @photocracy
        result.merge!({
          :visitor_votes  => next_prompt['visitor_votes'],
          :newright_photo => Photo.find(next_prompt['right_choice_text']).image.url(:medium),
          :newleft_photo  => Photo.find(next_prompt['left_choice_text']).image.url(:medium),
          :newleft_url    => vote_question_prompt_url(params[:question_id], next_prompt['id'], :direction => :left),
          :newright_url   => vote_question_prompt_url(params[:question_id], next_prompt['id'], :direction => :right)
        })
      end

      render :json => result.to_json
    else
      render :text => 'Vote unsuccessful.', :status => :unprocessable_entity
    end
  end
end
