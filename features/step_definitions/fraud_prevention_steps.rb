Then /^the left choice text should match the saved left choice text$/ do
  with_scope('#leftside') do
    expect(page).to have_content(@left_choice.data)
  end
  #Then "I should see \"#{@left_choice.data}\" within \"#leftside\""
end
Then /^the left choice text should not match the saved left choice text$/ do
  with_scope('#leftside') do
    expect(page).to have_no_content(@left_choice.data)
  end
  #Then "I should not see \"#{@left_choice.data}\" within \"#leftside\""
end

Then /^the right choice text should match the saved right choice text$/ do
  with_scope('#rightside') do
    expect(page).to have_content(@right_choice.data)
  end
  #Then "I should see \"#{@right_choice.data}\" within \"#rightside\""
end

