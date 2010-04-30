When /^I click on the left choice$/ do
	When "I follow \"leftside\""
	Capybara.default_wait_time = 10
end

When /^I click on the right choice$/ do
	When "I follow \"rightside\""
	Capybara.default_wait_time = 10
end
When /^I upload an idea titled '(.*)'$/ do |ideatext|
	When "I click the add new idea button"
	And "I fill in \"new_idea_field\" with \"#{ideatext}\""
	find("#submit_btn").click
end

When /^I click the (.*) button$/ do |button_name|
      case button_name
      when "I can't decide"
	find("#cant_decide_btn").click
      when "I can't decide submit"
	find(".cd_submit_button").click
      when "add new idea"
	find(".add_idea_button").click
      end
end

When /^I pick "I like both ideas"$/ do
	When "I choose \"cant_decide_reason_like_both\""
end

When /^I vote (\d*) times$/ do |num_votes|
	num_votes.to_i.times do
		if rand(2) == 1
		   When "I click on the left choice" 
		else
		   When "I click on the right choice"
		end

	end
end

When /^I upload (\d*) ideas$/ do |num_ideas|
	num_ideas.to_i.times do
		When "I upload an idea titled 'test'"
	end
end


Then /^the vote count should be (.*)$/ do |num_votes|
	Then "I should see \"#{num_votes}\" within \"#votes_count\""
end

Then /^the idea count should be (.*)$/ do |num_ideas|
	Then "I should see \"#{num_ideas}\" within \"#item_count\""
end


Then /^I should see a javascript alert$/ do
	Capybara.driver.is_alert_present.should be_true
end

Then /^the notification in the tell me area should contain links$/ do
	page.should have_css('.tellmearea a')
end

Then /^the notification in the tell me area should not contain links$/ do
	page.should_not have_css('.tellmearea a')
end
