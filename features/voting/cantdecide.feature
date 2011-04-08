Feature: I Can't Decide 
	In order to accurately measure preferences without forcing comparisons
	As a user
	Should be able to skip a prompt by saying "I can't decide"


	Background: 
		Given an idea marketplace quickly exists with url 'test'
		And I am on the Cast Votes page for 'test'

	Scenario: User sees menu of cant decide 
		When I click the I can't decide button
		Then I should see "I like both ideas"
		And I should see "I don't like either idea"
		And I should see "I don't know enough about:"
		And I should see "I don't know enough about either idea"
		And I should see "I think both ideas are the same"
		And I should see "I just can't decide"

	@selenium
	Scenario: User chooses i can't decide
		When I click the I can't decide button
		And I pick "I like both ideas"
		Then I should see "You couldn't decide." within ".tellmearea"
		And the vote count should be 0

	#@selenium
	#Scenario: User does not enter a choice
	#	When I click the I can't decide button
	#	And I click the I can't decide submit button
	#	Then I should not see "You couldn't decide."
	
	#@selenium
	#Scenario: User selects 'Other' but does not type in an answer
	#	When I click the I can't decide button
	#	And I pick "Other"
	#	And I click the I can't decide submit button
	#	Then I should not see "You couldn't decide."
