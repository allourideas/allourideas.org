Given /^an idea marketplace exists with url '(.*)'$/ do |url|
		Given "I am on the question create page"
		When "I fill in all fields with valid data except \"question_url\""
		And "I fill in \"question_url\" with \"#{url}\""
		And "I press \"Create\""

		Capybara.reset_sessions!
end
When /^I fill in all fields with valid data except "([^\"]*)"$/ do |field_id|
	valid_data = Hash[
		  "question_name" => "Valid question",
		  "question_url" => "taken",
		  "question_question_ideas" => "1",
		  "question_email" => "blah@blah.com",
		  "question_password" => "password"
	]


	valid_data.each do |k, v|
		if k == field_id
			next
		end
		When "I fill in \"#{k}\" with \"#{v}\""
	end



end
