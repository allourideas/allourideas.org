When /^I upload a photo$/ do
   photo = "#{Rails.root}/db/seed-images/princeton/#{rand(31)+1}.jpg"
   When "I click the add new photo button"
   And "I press \"choose_file\""
   And "I attach the file \"#{photo}\" to \"new_idea\""
   sleep(5) # I'd like to change this to some sort of visual feedback, not sure what that would be
end

When /^I upload a photo that is(?: (not))? too large$/ do |not_too_large|
  if not_too_large
    photo = "#{Rails.root}/db/seed-images/princeton/#{rand(31)+1}.jpg"
  else
    photo = "#{Rails.root}/db/seed-images/princeton/Rainbow_Denmark_Aalborg_20_sept_2004.png"
  end
  And "I attach the file \"#{photo}\" to \"uploadify\""
  And "I press \"Upload\""
end

Then /^the upload should fail$/ do
  page.should have_no_content('yeah!')
  page.should have_content('Choice creation failed')
end

Then /^the upload should succeed$/ do
  page.should have_content('yeah!')
  page.should have_no_content('Choice creation failed')
end
