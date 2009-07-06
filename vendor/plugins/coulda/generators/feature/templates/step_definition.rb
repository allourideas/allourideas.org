When /^I create a <%= resource %> named "([^\"]*)"$/ do |name|
  fills_in :name, :with => name
  click_button 'Create'
end
