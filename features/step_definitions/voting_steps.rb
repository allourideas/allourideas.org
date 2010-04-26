When /^I click on the left choice$/ do
	When "I follow \"leftside\""
	Capybara.default_wait_time = 10
end

When /^I click on the right choice$/ do
	When "I follow \"rightside\""
	Capybara.default_wait_time = 10
end
When /^I upload an idea titled '(.*)'$/ do |ideatext|
	When "I fill in \"new_idea_field\" with \"#{ideatext}\""
	find("#submit_btn").click
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

