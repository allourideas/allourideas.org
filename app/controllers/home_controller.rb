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
	  redirect_to(the_link)
    end

  end

  def about
    #about_question = Question.find(1)#Const::ABOUT_QUESTION_ID)
    # set_pairwise_user(about_question.user.email, about_question.user.decoded_password)
    # @id, @question, @items, @votes = Pairwise.get_question(about_question.pairwise_id)
    # @url1 = named_url_for_question(about_question)
  end

  
  def admin
    @questions_hash = {}
    if current_user.admin?

	if @photocracy
	  @earls = Earl.find(:all, :conditions => {:photocracy => true})
	else
	  @earls = Earl.find(:all, :conditions => {:photocracy => false})
	end
	@questions = Question.find(:all, :order => 'votes_count')
	@recent_votes_by_question_id = Question.get(:recent_votes_by_question_id)
	@user_submitted_idea_info = Question.get(:object_info_totals_by_question_id)


	if @recent_votes_by_question_id == "\n" #no data
		@recent_votes_by_question_id = {}
        end
	if @user_submitted_idea_info == "\n" #no data
		@user_submitted_idea_info = {}
        end
	
	@questions.each do |q|
		@questions_hash[q.id.to_s] = q
		if !@recent_votes_by_question_id.has_key?(q.id.to_s)
			@recent_votes_by_question_id[q.id.to_s] = 0
		end
		if !@user_submitted_idea_info.has_key?(q.id.to_s)
			@user_submitted_idea_info[q.id.to_s] = {}
			@user_submitted_idea_info[q.id.to_s]["total_ideas"] = 0
			@user_submitted_idea_info[q.id.to_s]["active_ideas"] = 0
		end
		if !@user_submitted_idea_info[q.id.to_s].has_key?("active_ideas")
			@user_submitted_idea_info[q.id.to_s]["active_ideas"] = 0
		end

	end


        @available_charts = {}
        @available_charts['votes'] = { :title => "Number of all votes over time"}
        @available_charts['user_submitted_ideas'] = { :title => "Number of all submitted ideas over time"}
        @available_charts['user_sessions'] = { :title => "Number of all user sessions per day"}
        @available_charts['unique_users'] = { :title => "Number of all unique users per day"}
    else
    	@earls = current_user.earls.sort_by {|x| [(!x.active).to_s, x.name]}
	@recent_votes_by_question_id = Question.get(:recent_votes_by_question_id, :creator_id => current_user.id)

	if @recent_votes_by_question_id == "\n" #no data
		@recent_votes_by_question_id = {}
        end

	@earls.each do|e|
		if !@recent_votes_by_question_id.has_key?(e.question_id.to_s)
			@recent_votes_by_question_id[e.question_id.to_s] = 0
		end
	end
    end


  end

end
