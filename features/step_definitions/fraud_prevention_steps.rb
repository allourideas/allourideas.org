Then /^the left choice text should match the saved left choice text$/ do
    Then "I should see \"#{@left_choice.data}\" within \"#leftside\""
end
Then /^the left choice text should not match the saved left choice text$/ do
    Then "I should not see \"#{@left_choice.data}\" within \"#leftside\""
end

Then /^the right choice text should match the saved right choice text$/ do
    Then "I should see \"#{@right_choice.data}\" within \"#rightside\""
end

