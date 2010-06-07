When /^I click on the left choice$/ do
	When "I follow \"leftside\""
	Capybara.default_wait_time = 10
	Then "I should see \"You chose\" within \".tellmearea\""
end

When /^I click on the right choice$/ do
	When "I follow \"rightside\""
	Capybara.default_wait_time = 10
	Then "I should see \"You chose\" within \".tellmearea\""
end

When /^I click the flag link for the (.*) choice$/ do |side|
	if side == "left"
		When "I follow \"left_flag\""
        else
		When "I follow \"right_flag\""
	end

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
        page.evaluate_script('window.alert = function() { return true; }') # prevent javascript alerts from popping up
	find(".cd_submit_button").click
      when "add new idea"
	find(".add_idea_button").click
      when "flag submit"
        page.evaluate_script('window.alert = function() { return true; }')
	find("#facebox .flag_submit_button").click
      end
end

When /^I pick "(.*)"$/ do |radio_label|
	case radio_label 
	when "I like both ideas"
           When "I choose \"cant_decide_reason_like_both\""
	when "Other"
           When "I choose \"cant_decide_reason_user_other\""
	end
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

Given /^I save the current (.*) choices?$/ do |side|
	@question_id = page.locate('#leftside')[:rel].to_i
	
	#The above doesn't work with selenium, for some unknown reason. Fall back to using jquery: 
        begin
	  @prompt_id = page.locate('#prompt_id')[:value].to_s
	rescue Capybara::ElementNotFound
          @prompt_id = page.evaluate_script("$('#prompt_id').val()").to_i
	end
	if @prompt_id.blank?
	  raise Capybara::ElementNotFound
	end

        @prompt = Prompt.find(@prompt_id, :params => {:question_id => @question_id})

	if side == "left" or side == "two"
	  @left_choice_text = page.locate('#leftside').text.to_s
          @left_choice = Choice.find(@prompt.left_choice_id, :params => {:question_id => @question_id})
	end
	if side == "right" or side == "two"
	  @right_choice_text= page.locate('#rightside').text.to_s
          @right_choice = Choice.find(@prompt.right_choice_id, :params => {:question_id => @question_id})
	end
end

Then /^the saved left choice should not be active$/ do
	@left_choice.reload
	@left_choice.should_not be_active
end

When /^I close the facebox$/ do
        page.evaluate_script("$.facebox.close();")
end
