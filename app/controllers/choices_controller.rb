class ChoicesController < ApplicationController
  def show
    @question = Question.find_by_name(params[:question_id])
    @choice = Choice.find(params[:id], :params => {:question_id => @question.id})
    if @choice
      @data = @choice.attributes['data']
      @score = @choice.attributes['score'].round
      logger.info "the score is #{@score.inspect}"
      @created_at = @choice.attributes['created_at']
      @votes_count = @choice.attributes['votes_count']
      respond_to do |format|
        format.html # show.html.erb
      end
    else
      redirect_to('/') and return
    end
  end
end