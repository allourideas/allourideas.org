
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

Then /^a background job should have been created$/ do
	Delayed::Job.count.should == 1
end

Then /^the the background job should call '(.*)'$/ do |method|
	Delayed::Job.last.name == method
	
end

When /^I deactivate the two saved choices$/ do
        @left_choice.put(:deactivate_from_abroad, :params => {:question_id => @question.id})
        @right_choice.put(:deactivate_from_abroad, :params => {:question_id => @question.id})
end
