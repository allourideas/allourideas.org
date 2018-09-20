
Given /^I am on the the super admin dashboard page$/ do
         visit '/admin'
end

Given /^there are no Delayed Jobs$/ do
	Delayed::Job.delete_all
end

When /^I click on the link for an idea marketplace creator map$/ do
	  pending # express the regexp above with the code you wish you had
end

Then /^the map should load with no errors$/ do
	  pending # express the regexp above with the code you wish you had
end

When /^I click on the request button for the (.*) CSV file$/ do |type|
	 When "I follow \"#{type.downcase.gsub(/ +/, "_")}_request_link\""

end

When /^I click "([^"]*)"$/ do |arg1|
  find(arg1).click
end

Then /^a background job should have been created$/ do
	Delayed::Job.count.should == 1
end

Then /^the the background job should call '(.*)'$/ do |method|
	Delayed::Job.last.name == method
	
end

When /^I click on the edit link for the question$/ do 
	find('th.header:first a').click
end

When /^I click on the Status header column$/ do 
	find('th.score:last').click
end
When /^I click on the toggle link for the first choice$/ do 
        sleep(3) # "activate a deactivated idea" can fail without this
	find('.toggle_choice_status').click
end
Then /^the first choice should be (.*)$/ do |status|
	Then "I should see \"#{status}\" within \".toggle_choice_status\""
end
When /^I deactivate the two saved choices$/ do
	# reload kills prefix options, rails hasn't merged in a fix yet, see 
	# https://rails.lighthouseapp.com/projects/8994-ruby-on-rails/tickets/810
	@left_choice.reload
	@left_choice.prefix_options[:question_id] = @question_id
        @left_choice.active = false
	@left_choice.save

	@right_choice.reload
	@right_choice.prefix_options[:question_id] = @question_id
        @right_choice.active = false
        @right_choice.save
end

When /^I deactivate the saved left choice$/ do
	@left_choice.reload
	@left_choice.prefix_options[:question_id] = @question_id
	@left_choice.active = false
	@left_choice.save
end

Then /^I should not see the saved (.*) choice text$/ do |side|
	choice = (side == "left") ? @left_choice : @right_choice

	Then "I should not see \"#{choice.data}\""
end

Then /^I should see the saved (.*) choice text$/ do |side|
  choice = (side == "left") ? @left_choice : @right_choice
  #Then "I should see \"#{choice.data}\""
  expect(page).to have_content(choice.data)
end

Given /^idea marketplace '(.*)' has enabled idea autoactivation$/ do |url|
 set_active_resource_credentials
 @earl = Earl.find(url)
 @question = Question.find(@earl.question_id)
 @question.it_should_autoactivate_ideas = true
 @question.save
end

Given /^idea marketplace '(.*)' has results hidden$/ do |url|
 set_active_resource_credentials
 @earl = Earl.find(url)
 @earl.hide_results = true
end

Given /^a super admin user exists with credentials "(.*)\/(.*)"$/ do |email, password|
  user = FactoryBot :email_confirmed_user,
    :email                 => email,
    :password              => password,
    :password_confirmation => password,
    :admin		   => true
end

Given /^I sign in as the admin for '(.*)'$/ do |url|
  earl = Earl.find(url)
  visit root_path(as: earl.user)
end

