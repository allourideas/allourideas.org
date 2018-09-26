Given /^an idea marketplace exists with url '(.*)'$/ do |url|
  visit new_question_path
  fill_in_all_fields_with_valid_data_except('question_url')
  fill_in('question_url', :with => url)
  click_button('Create')
  #Given "I am on the question create page"
  #When "I fill in all fields with valid data except \"question_url\""
  #And "I fill in \"question_url\" with \"#{url}\""
  #And "I press \"Create\""

  Capybara.reset_sessions!
end

Given /^an idea marketplace exists with admin '(.*)' and password '(.*)' and url '(.*)'$/ do |email, password, url|
  visit new_question_path
  fill_in_all_fields_with_valid_data_except('question_url')
  fill_in('question_email', :with => email)
  fill_in('question_password', :with => password)
  fill_in('question_url', :with => url)
  click_button('Create')
  #Given "I am on the question create page"
  #When "I fill in all fields with valid data except \"question_email\""
  #And "I fill in \"question_email\" with \"#{email}\""
  #And "I fill in \"question_password\" with \"#{password}\""
  #And "I fill in \"question_url\" with \"#{url}\""
  #And "I press \"Create\""

  Capybara.reset_sessions!
end

Given /^an idea marketplace exists with admin '(.*)' and url '(.*)' and (\d+) ideas$/ do |email, url, num_ideas|

  ideas_text = ""
  num_ideas.to_i.times do |i|
    ideas_text += i.to_s
    ideas_text += "\n"
  end
  visit new_question_path
  fill_in_all_fields_with_valid_data_except('question_url')
  fill_in('question_email', :with => email)
  fill_in('question_url', :with => url)
  fill_in('question_ideas', :with => ideas_text)
  click_button('Create')


  #Given "I am on the question create page"
  #When "I fill in all fields with valid data except \"question_email\""
  #And "I fill in \"question_email\" with \"#{email}\""
  #And "I fill in \"question_url\" with \"#{url}\""
  #And "I fill in \"question_ideas\" with \"#{ideas_text}\""
  #And "I press \"Create\""

  Capybara.reset_sessions!
end

Given /^I fill in all fields with valid data except "([^\"]*)"$/ do |field_id|
  fill_in_all_fields_with_valid_data_except(field_id)
end

def fill_in_all_fields_with_valid_data_except(field_id)
  valid_data = Hash[
      "question_name" => "Valid question",
      "question_url" => "taken",
      "question_ideas" => "1",
      "question_email" => "blah@blah.com",
      "question_password" => "password"
  ]


  valid_data.each do |k, v|
    if k == field_id
      next
    end
    fill_in(k, :with => v)
  end
end

Given /^an idea marketplace quickly exists with url '([^\']*)'$/ do |url|
  q = Question.create(FactoryBot.attributes_for(:question_cucumber))
  e = FactoryBot.create(:earl, :name => url, :question_id => q.id)
end

Given /^an idea marketplace quickly exists with url '([^\']*)' and admin '(.*)\/(.*)'$/ do |url, email, password|
  user = FactoryBot.create(:email_confirmed_user, :email => email, :password => password)
  question = Question.create(FactoryBot.attributes_for(:question_cucumber))
  earl = FactoryBot.create(:earl, :name => url, :question_id => question.id)
  # Given "an idea marketplace quickly exists with url '#{url}'"
  earl.user = user
  earl.save
end

Given /^a photocracy idea marketplace quickly exists with url '([^\']*)'$/ do |url|
  photos = []
  3.times do |i|
    p = Photo.create! :image => ActionController::TestUploadedFile.new("#{Rails.root}/db/seed-images/princeton/#{i+1}.jpg", "image/jpg")

    photos << p.id
  end
  
  q = Question.create(FactoryBot.attributes_for(:question_cucumber, :ideas => photos.join("\n")))
  e = FactoryBot.create(:earl, :name => url, :question_id => q.id)
end

Given /^a photocracy idea marketplace quickly exists with url '([^\']*)' and admin '(.*)\/(.*)'$/ do |url, email, password|
  u = FactoryBot.create(:email_confirmed_user, :email => email, :password => password, :password_confirmation => password)

  Given "a photocracy idea marketplace quickly exists with url '#{url}'"
  e = Earl.last
  e.user = u
  e.save
end

Given /^an idea marketplace quickly exists with url '(.*)' and (.*) ideas$/ do |url, num_ideas|
  ideas = ""
  (1..num_ideas.to_i).to_a.reverse.each do |n|
    ideas += "Idea ##{n}" + "\n"
  end
  q = Question.create(FactoryBot.attributes_for(:question_cucumber, :ideas => ideas))
  e = FactoryBot.create(:earl, :name => url, :question_id => q.id)
end


Given /^an idea marketplace quickly exists with question title '(.*)' and admin '(.*)\/(.*)'$/ do |title, email, password|
  u = FactoryBot.create(:email_confirmed_user, :email => email, :password => password)

  q = Question.create(FactoryBot.attributes_for(:question_cucumber, :name => title, :local_identifier => u.id))
  e = FactoryBot.create(:earl, :user => u, :question_id => q.id)
end


When /^idea marketplace '(.*)' has (\d*) ideas$/ do |url, num_ideas|
  e = Earl.find(url)
  @question = Question.find(e.question_id)

  prev_auto_activate = @question.it_should_autoactivate_ideas
  
  unless prev_auto_activate
          @question.it_should_autoactivate_ideas = true
          @question.save
  end
        

  #Pairwise sorts by last created, but this makes testing pagination annoying, let's create these going down
  (1..num_ideas.to_i).to_a.reverse.each do |n|
    the_params = {:visitor_identifier => 'test choices', :data => "Idea ##{"%03d" % n}", :question_id => @question.id, :active => true}
    choice = Choice.create(the_params)
    expect(choice).to_not eq nil
  end

  unless prev_auto_activate
          @question.reload
          @question.it_should_autoactivate_ideas = false
          @question.save
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

Given /^admin activates last idea of "([^\"]*)"$/ do |url|
  earl = Earl.find(url)
  Choice.find(:all, :params => {:question_id => earl.question_id, :include_inactive => true}).each do |choice|
    choice.active = true
    choice.save
  end
end

