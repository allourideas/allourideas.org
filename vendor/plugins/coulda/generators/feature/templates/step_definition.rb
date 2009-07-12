<% if %w(new create).any? { |action| actions.include?(action) } -%>
When /^I create a <%= resource %> named "([^\"]*)"$/ do |name|
  fills_in :name, :with => name
  click_button 'Create'
end
<% elsif %w(edit update).any? { |action| actions.include?(action) } -%>
When /^I update a post named "([^\"]*)"$/ do |name|
  fills_in :name, :with => name
  click_button 'Update'
end
<% end -%>

