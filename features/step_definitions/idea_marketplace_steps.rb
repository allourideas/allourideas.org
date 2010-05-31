Given /^an idea marketplace exists with url '(.*)'$/ do |url|
		Given "I am on the question create page"
		When "I fill in all fields with valid data except \"question_url\""
		And "I fill in \"question_url\" with \"#{url}\""
		And "I press \"Create\""

		Capybara.reset_sessions!
end
Given /^an idea marketplace exists with admin '(.*)' and password '(.*)' and url '(.*)'$/ do |email, password, url|
		Given "I am on the question create page"
		When "I fill in all fields with valid data except \"question_email\""
		And "I fill in \"question_email\" with \"#{email}\""
		And "I fill in \"question_password\" with \"#{password}\""
		And "I fill in \"question_url\" with \"#{url}\""
		And "I press \"Create\""

		Capybara.reset_sessions!
end

Given /^an idea marketplace exists with admin '(.*)' and url '(.*)' and (\d+) ideas$/ do |email, url, num_ideas|

		ideas_text = ""
		num_ideas.to_i.times do |i|
			ideas_text += i.to_s
			ideas_text += "\n"
		end


		Given "I am on the question create page"
		When "I fill in all fields with valid data except \"question_email\""
		And "I fill in \"question_email\" with \"#{email}\""
		And "I fill in \"question_url\" with \"#{url}\""
		And "I fill in \"question_question_ideas\" with \"#{ideas_text}\""
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

When /^idea marketplace '(.*)' has (\d*) ideas$/ do |url, num_ideas|
	e = Earl.find(url)
	@question = Question.find(e.question_id)

	prev_auto_activate = @question.it_should_autoactivate_ideas
	
	unless prev_auto_activate
          @question.put(:set_autoactivate_ideas_from_abroad, :question => { :it_should_autoactivate_ideas => true}) 
	end
        
	num_ideas.to_i.times do |n|
	  the_params = {'auto' => 'test choices', :data => "fake idea : #{n}", :question_id => @question.id}
          Choice.post(:create_from_abroad, :question_id => @question.id, :params => the_params)
	end

	unless prev_auto_activate
          @question.put(:set_autoactivate_ideas_from_abroad, :question => { :it_should_autoactivate_ideas => false}) 
	end
end

Given /^the default locale for '(.*)' is '(.*)'$/ do |url, locale|
	e = Earl.find(url)
	e.default_lang = locale
	e.save
end

Given /^idea marketplace '(.*)' has enabled "([^\"]*)"$/ do |url, setting|
	e = Earl.find(url)
	case setting.downcase
	when "flag as inappropriate"
		e.flag_enabled = true
	end
	e.save!
end

