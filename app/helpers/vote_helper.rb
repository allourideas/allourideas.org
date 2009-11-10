module VoteHelper
  def vote_params
    { :prompt_id => @prompt_id, :id => @question_id, :name => @name }
  end

  def loc_based_style(link, loc)
    @current_page == loc ? "<strong>#{link}</strong>" : link
  end
end
