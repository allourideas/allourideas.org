When /^I click on the left choice$/ do
	When "I follow \"leftside\""
	Capybara.default_wait_time = 10
end

When /^I upload an idea titled '(.*)'$/ do |ideatext|
	When "I fill in \"new_idea_field\" with \"#{ideatext}\""
	find("#submit_btn").click

end

