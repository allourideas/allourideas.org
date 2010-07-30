When /^I upload a photo$/ do
   photo = "#{Rails.root}/db/seed-images/princeton/#{rand(31)+1}.jpg"
   When "I click the add new photo button"
   And "I press \"choose_file\""
   And "I attach the file \"#{photo}\" to \"new_idea\""
   sleep(5) # I'd like to change this to some sort of visual feedback, not sure what that would be
end
