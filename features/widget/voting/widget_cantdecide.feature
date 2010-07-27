Feature: I Can't Decide 
	In order to accurately measure preferences without forcing comparisons
	As a user
	Should be able to skip a prompt by saying "I can't decide" on the widget


	Background: 
		Given an idea marketplace quickly exists with url 'test'
		And I am on the WIDGET Cast Votes page for 'test'

  @widget2
	Scenario: User sees menu of cant decide 
		When I click the I can't decide button
		Then I should see "I like both ideas"
		And I should see "I don't like either idea"
		And I should see "I don't know enough about either"
		And I should see "Other"

  @widget2
	@selenium
	Scenario: User chooses i can't decide
		When I click the I can't decide button
		And I pick "I like both ideas"
		And I click the I can't decide submit button
		Then I should see "You couldn't decide." within ".tellmearea"

  @widget2
	@selenium
	Scenario: User does not enter a choice
		When I click the I can't decide button
		And I click the I can't decide submit button
		Then I should not see "You couldn't decide."

  @widget2
	@selenium
	Scenario: User selects 'Other' but does not type in an answer
		When I click the I can't decide button
		And I pick "Other"
		And I click the I can't decide submit button
		Then I should not see "You couldn't decide."
