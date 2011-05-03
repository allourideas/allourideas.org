class HomeController < ApplicationController
  include ActionView::Helpers::TextHelper
  #caches_page :about, :tour, :privacy
  before_filter :authenticate, :only => [:admin]
  before_filter :admin_only, :only => [:no_google_tracking]

  def index
  end

  def no_google_tracking
  end

  def example
    ab_test("Test example marketplace", ["/studentgovernment", "/priority_example"], :conversion => 'voted') do |the_link|
	  redirect_to(the_link) and return
    end

  end

  def about
    #about_question = Question.find(1)#Const::ABOUT_QUESTION_ID)
    # set_pairwise_user(about_question.user.email, about_question.user.decoded_password)
    # @id, @question, @items, @votes = Pairwise.get_question(about_question.pairwise_id)
    # @url1 = named_url_for_question(about_question)
  end

  def admin
    if current_user.admin?
      if @photocracy
        @earls = Earl.find(:all, :conditions => {:photocracy => true})
      else
        @earls = Earl.find(:all, :conditions => {:photocracy => false})
      end
      @questions = Question.find(:all, :params => {
                                   :votes_since => Date.today,
                                   :user_ideas => true,
                                   :active_user_ideas => true })

      @available_charts = {}
      @available_charts['votes'] = { :title => "Number of all votes over time"}
      @available_charts['user_submitted_ideas'] = { :title => "Number of all submitted ideas over time"}
      @available_charts['user_sessions'] = { :title => "Number of all user sessions per day"}
      @available_charts['unique_users'] = { :title => "Number of all unique users per day"}
    else
      @earls = current_user.earls.sort_by {|x| [(!x.active).to_s, x.name]}
      @questions = Question.find(:all, :params => {
                                   :creator => current_user.id,
                                   :votes_since => Date.today })
                                   
    end
    @questions_map = @questions.inject({}){ |h,q| h[q.id] = q; h }
  end
end
