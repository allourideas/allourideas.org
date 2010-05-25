Feature: Flag as inappropriate
	In order to prevent unsavory materials from being displayed on our site
	A user
	Should be able to flag a choice as inappropriate


	Background: 
		Given an idea marketplace exists with admin 'flag_test@test.com' and url 'test' and 5 ideas
		And I am on the Cast Votes page for 'test'
		And I save the current left choice
		And no emails have been sent

	@focus
	@selenium
	Scenario: User flags choice as inappropriate
		When I click the flag link for the left choice
		Then I should see "Please explain why this choice is inappropriate: " within "#facebox"

	@focus
	@selenium
	Scenario: User submits a flag request
		When I click the flag link for the left choice
		And I fill in "inappropriate_reason" with "Because it's offensive"
		And I click the flag submit button
		Then I should see "You flagged a choice as inappropriate." within ".tellmearea"
		And the saved left choice should not be active
		And "flag_test@test.com" should receive an email 
		When "flag_test@test.com" opens the email
		Then they should see "[All Our Ideas] Possible inappropriate idea flagged by user" in the email subject
		And they should see "Because it's offensive" in the email body
		
	@focus2
	@selenium
	Scenario: User clicks flag link but does not type in an answer
		When I click the flag link for the left choice
		And I click the flag submit button
		Then I should not see "You flagged a choice as inappropriate."
		
