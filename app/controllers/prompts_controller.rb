class PromptsController < ActionController::Base
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
      logger.info(next_prompt.inspect)
      render :json => {
        :newleft           => truncate(next_prompt['left_choice_text'], 137),
        :newright          => truncate(next_prompt['right_choice_text'], 137),
        :appearance_lookup => next_prompt['appearance_id'],
        :prompt_id         => next_prompt['id'],
        :leveling_message  => leveling_message,
      }.to_json
    else
      render :text => 'Vote unsuccessful.', :status => :unprocessable_entity
    end
  end
end
