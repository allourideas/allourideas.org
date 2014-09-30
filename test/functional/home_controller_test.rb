require 'test_helper'

class HomeControllerTest < ActionController::TestCase
	context "on GET to :index" do
	   setup do
	      get :index
	   end
	   should_not_set_the_flash
	   should_respond_with :success
	end

	should "not let an unauthenticated user access /admin" do
		get :admin
		assert_response :redirect
		assert_redirected_to :controller=>"clearance/sessions", :action=>"new"
	end
	#context "when signed in as normal user on GET to admin" do
	#        setup do
	#	      @user = Factory(:email_confirmed_user)
	#              sign_in_as @user
	#	      get :admin
	#        end
	#    	should_respond_with :success

	#	should "have zero earls to display" do
	#		assert assigns("earls")== []
	#	end
	#	should "have zero updated votes to display" do
	#		assert assigns("recent_votes_by_question_id")=={}
	#	end
	#end
	#context "when signed in as normal user with earls on GET to admin" do
	#        setup do
	#	      @user = Factory(:email_confirmed_user)
	#	      newEarl = Factory.create(:earl, :user_id => @user.id)
	#              sign_in_as @user
	#	      get :admin
	#        end
	#    	should_respond_with :success

	#	should "have zero earls to display" do
	#		assert assigns("earls").size ==1
	#	end
	#end
	#context "when signed in as admin on GET to admin" do
	#        setup do
	#	      @user = Factory(:user, :admin => true)
	#	      nonUserEarl = Factory.create(:earl, :user_id => (@user.id + 3))
	#	      nonUserEarl2 = Factory.create(:earl, :user_id => (@user.id + 4))
	#	      nonUserEarl3 = Factory.create(:earl, :user_id => (@user.id + 5))
	#	      userEarl = Factory.create(:earl, :user_id => @user.id)
	#              sign_in_as @user
	#	      get :admin
	#        end
	#    	should_respond_with :success

	#	should "display all system earls" do
	#		assert assigns("earls").size == 4
	#	end

	#	should "display clicks information and idea marketplace info" do

	#	end
	#end

end

