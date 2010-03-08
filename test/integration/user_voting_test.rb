require 'test_helper'

class UserVotingTest < ActionController::IntegrationTest
  context "interacting on an existing question" do
     setup do 
 	@earl = Factory.create(:student_government_earl)
     end
     
     should "be able to vote and get feedback on votes" do
	  
	  visit "/#{@earl.name}"
	  @question = @earl.question
          current_items = @question.attributes['item_count']
          current_votes = @question.attributes['votes_count']
	  assert_contain "Which do you want more from the student government?"
	  assert_contain "#{current_votes} Votes on #{current_items} Ideas"
	  selenium.click_link "leftside" #javascript
	  assert_contain "#{current_votes+1} Votes on #{current_items} Ideas"
	  
     end
     should "be able to view results" do
	  visit "/#{@earl.name}"
          click_link_within '.vote-nav', "View Results"
	  selenium.wait_for_page_to_load(15) # this takes a long time to load, probably should fix that
	  assert_contain "Data Visualizations"
     end
     should "be able to view log in page" do
	  visit "/#{@earl.name}"
          click_link "Log In"
	  assert_contain "Log in to your account"
     end
     should "be able to view about page" do
	  visit "/#{@earl.name}"
          click_link "About"
	  assert_contain "About this project"
     end
  end
end
