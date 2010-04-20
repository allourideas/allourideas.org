Feature: I Can't Decide 
	In order to accurately measure preferences without forcing comparisons
	As a user
	Should be able to skip a prompt by saying "I can't decide"


	Background: 
		Given that a test question named 'test' exists
		And the question 'test' has four choices

	Scenario: User sees menu of cant decide 
		Given that I am on the vote page for 'test'
		When I click the I can't decide button
		Then I should see 'I like both ideas'
		And I should see 'I don't like either idea'
		And I should see 'I don't know enough about [left idea]'
		And I should see 'I don't know enough about [right idea]'
		And I should see 'I don't know enough about both ideas'
		And I should see 'I think both ideas are the same'
		And I should see 'I just can't decide'

	Scenario: User chooses i can't decide
		Given that I am the vote page for 'test'
		And the vote count for 'test' is 0
		When I click the I can't decide button
		And I click 'I like both ideas'
		Then the vote count for 'test' should be 0
		And I should see 'You couldn't decide. Try choosing between these two!'
	
	
	Scenario: User reloads page to try to skip
		Given that I am on the vote page for 'test'
		And the left choice text is 'x'
		And the right choice text is 'y'
		When I reload the page
		Then the left choice text should be 'x'
		And the right choice text should be 'y'
		
