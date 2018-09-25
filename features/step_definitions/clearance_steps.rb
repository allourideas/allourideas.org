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
  expect(User.find_by_email(email)).to eq nil
end

Given /^I signed up with "(.*)\/(.*)"$/ do |email, password|
  user = FactoryBot.create( :user,
    :email                 => email,
    :password              => password)
end

Given /^I am signed up and confirmed as "(.*)\/(.*)"$/ do |email, password|
  user = FactoryBot.create( :email_confirmed_user,
    :email                 => email,
    :password              => password)
end

# Session

Then /^I should be signed in as "([^\"]*)"$/ do |email|
  visit root_path
  within ".navbar-aoi" do
    expect(page).to have_content(email)
  end

  #Given %{I am on the homepage}
  #Then %{I should see "#{email}" within ".navbar-aoi"}
end

Then /^I should be signed out$/ do
  visit root_path
  expect(page).to have_content("Log In")

  #Given %{I am on the homepage}
  #Then %{I should see "Log In"}
end

When /^session is cleared$/ do
  request.reset_session
  controller.instance_variable_set(:@_current_user, nil)
end

Given /^I have signed in with "(.*)\/(.*)"$/ do |email, password|
  user = FactoryBot.create( :email_confirmed_user,
    :email                 => email,
    :password              => password)
  visit root_path(as: user)

  #Given %{I am signed up and confirmed as "#{email}/#{password}"}
  #And %{I sign in as "#{email}/#{password}"}
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
  expect(user.confirmation_token.present?).to eq true
  expect(unread_emails_for(email).size).to eql parse_email_count(1)
  open_email(email)
  expect(current_email).to have_subject('Change your password')
  expect(current_email.default_part_body.to_s).to include(user.confirmation_token)

  #Then "\"#{email}\" should receive an email"
  #When "\"#{email}\" opens the email"
  #Then "they should see \"Change your password\" in the email subject"
  #Then "they should see \"#{user.confirmation_token}\" in the email body"
end

When /^I follow the password reset link sent to "(.*)"$/ do |email|
  user = User.find_by_email(email)
  user.forgot_password!
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
  visit new_session_path
  fill_in('Email', :with => email)
  fill_in('Password', :with => password)
  click_button('Log In')

  #When %{I go to the sign in page}
  #And %{I fill in "Email" with "#{email}"}
  #And %{I fill in "Password" with "#{password}"}
  #And %{I press "Log In"}
end

When /^I sign out$/ do
  visit '/sign_out'
end

When /^I request password reset link to be sent to "(.*)"$/ do |email|
  visit new_password_path
  fill_in('Email', :with => email)
  click_button('Reset password')

  #When %{I go to the password reset request page}
  #And %{I fill in "Email" with "#{email}"}
  #And %{I press "Reset password"}
end

When /^I update my password with "(.*)\/(.*)"$/ do |password, confirmation|
  fill_in('Password', :with => password)
  fill_in('Password Confirmation', :with => confirmation)
  click_button('Save this password')

  #And %{I fill in "Password" with "#{password}"}
  #And %{I fill in "Password Confirmation" with "#{confirmation}"}
  #And %{I press "Save this password"}
end

When /^I return next time$/ do
  visit root_path

  #When %{I go to the homepage}
end
