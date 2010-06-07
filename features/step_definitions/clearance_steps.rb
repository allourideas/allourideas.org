# General

Then /^I should see error messages$/ do
  if respond_to?(:page)
    assert_match /error(s)? prohibited/m, page.body
  else
    assert_match /error(s)? prohibited/m, response.body
  end
end

# Database

Given /^no user exists with an email of "(.*)"$/ do |email|
  assert_nil User.find_by_email(email)
end

Given /^I signed up with "(.*)\/(.*)"$/ do |email, password|
  user = Factory :user,
    :email                 => email,
    :password              => password,
    :password_confirmation => password
end 

Given /^I am signed up and confirmed as "(.*)\/(.*)"$/ do |email, password|
  user = Factory :email_confirmed_user,
    :email                 => email,
    :password              => password,
    :password_confirmation => password
end

# Session

Then /^I should be signed in as "([^\"]*)"$/ do |email|
  Given %{I am on the homepage}
  Then %{I should see "Logged in as #{email}"}
 end

Then /^I should be signed out$/ do
  Given %{I am on the homepage}
  Then %{I should see "Log In"}
end

When /^session is cleared$/ do
  request.reset_session
  controller.instance_variable_set(:@_current_user, nil)
end

Given /^I have signed in with "(.*)\/(.*)"$/ do |email, password|
  Given %{I am signed up and confirmed as "#{email}/#{password}"}
  And %{I sign in as "#{email}/#{password}"}
end

# Emails

Then /^a confirmation message should be sent to "(.*)"$/ do |email|
  user = User.find_by_email(email)
  sent = ActionMailer::Base.deliveries.first
  assert_equal [user.email], sent.to
  assert_match /confirm/i, sent.subject
  assert !user.confirmation_token.blank?
#  assert_match /#{user.confirmation_token}/, sent.body 
  # We don't include the confirm token
end

When /^I follow the confirmation link sent to "(.*)"$/ do |email|
  user = User.find_by_email(email)
  visit new_user_confirmation_path(:user_id => user,
                                   :token   => user.confirmation_token)
end

Then /^a password reset message should be sent to "(.*)"$/ do |email|
  user = User.find_by_email(email)
  assert !user.confirmation_token.blank?
  Then "\"#{email}\" should receive an email"
  When "\"#{email}\" opens the email"
  Then "they should see \"Change your password\" in the email subject"
  Then "they should see \"#{user.confirmation_token}\" in the email body"
end

When /^I follow the password reset link sent to "(.*)"$/ do |email|
  user = User.find_by_email(email)
  visit edit_user_password_path(:user_id => user,
                                :token   => user.confirmation_token)
end

When /^I try to change the password of "(.*)" without token$/ do |email|
  user = User.find_by_email(email)
  visit edit_user_password_path(:user_id => user)
end

Then /^I should be forbidden$/ do
  assert_response :forbidden
end

# Actions

When /^I sign in as "(.*)\/(.*)"$/ do |email, password|
  When %{I go to the sign in page}
  And %{I fill in "Email" with "#{email}"}
  And %{I fill in "Password" with "#{password}"}
  And %{I press "Log In"}
end

When /^I sign out$/ do
  visit '/sign_out'
end

When /^I request password reset link to be sent to "(.*)"$/ do |email|
  When %{I go to the password reset request page}
  And %{I fill in "Email" with "#{email}"}
  And %{I press "Reset password"}
end

When /^I update my password with "(.*)\/(.*)"$/ do |password, confirmation|
  And %{I fill in "Password" with "#{password}"}
  And %{I fill in "Password Confirmation" with "#{confirmation}"}
  And %{I press "Save this password"}
end

When /^I return next time$/ do
  When %{I go to the homepage}
end
