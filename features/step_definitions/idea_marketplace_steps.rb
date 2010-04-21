Given /^an idea marketplace exists with url '(.*)'$/ do |url|
	Factory.create(:earl, :name => url)
end
When /^I fill in all fields with valid data except "([^\"]*)"$/ do |field_id|
	valid_data = Hash[
		  "question_name" => "Valid question",
		  "question_url" => "taken",
		  "question_question_ideas" => "1",
		  "question_email" => "blah@blah.com",
		  "question_password" => "password"
	]

	if field_id == "question_email"

	end

	valid_data.each do |k, v|
		if k == field_id
			next
		end
		When "I fill in \"#{k}\" with \"#{v}\""
	end



end
