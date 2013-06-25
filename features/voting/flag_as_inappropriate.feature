Feature: Flag as inappropriate
	In order to prevent unsavory materials from being displayed on our site
	A user
	Should be able to flag a choice as inappropriate


	Background: 
		Given an idea marketplace exists with admin 'flag_test@test.com' and url 'test' and 5 ideas
	        And idea marketplace 'test' has enabled "flag as inappropriate"
		And I am on the Cast Votes page for 'test'
		And I save the current left choice
		And no emails have been sent

	@javascript
	Scenario: User flags choice as inappropriate
		When I click the flag link for the left choice
		Then I should see "Please explain why this choice is inappropriate: " within "#flag_inappropriate"

	@javascript
	Scenario: User submits a flag request
		When I click the flag link for the left choice
		And I fill in "inappropriate_reason" with "Because it's offensive"
		And I click the flag submit button
		Then the idea count should be 4
		And the saved left choice should not be active
		And "flag_test@test.com" should receive an email 
		When "flag_test@test.com" opens the email
		Then they should see "[All Our Ideas] Possible inappropriate idea flagged by user" in the email subject
		And they should see "Because it's offensive" in the email body
		
	@javascript
	Scenario: User clicks flag link but does not type in an answer
		When I click the flag link for the left choice
		And I click the flag submit button
		Then I should not see "You flagged a choice as inappropriate."
		
	@javascript
	Scenario: User flags all but one choices in marketplace
		Given an idea marketplace exists with admin 'flag_test2@test.com' and url 'test_2' and 2 ideas
	        And idea marketplace 'test_2' has enabled "flag as inappropriate"
		And I am on the Cast Votes page for 'test_2'
		And no emails have been sent
		When I click the flag link for the left choice
		And I fill in "inappropriate_reason" with "Because it's offensive"
		And I click the flag submit button
		Then I should see "You flagged an idea as inappropriate. We have deactivated this idea temporarily and sent a notification to the idea marketplace owner. Currently, this idea marketplace does not have enough active ideas. Please contact the owner of this marketplace to resolve this situation"
		And I should be on the homepage

		And "flag_test2@test.com" should receive an email 
		When I go to the Cast Votes page for 'test_2'
		Then I should see "This idea marketplace does not have enough active ideas. Please contact the owner of this marketplace to resolve this situation"
		And I should be on the homepage
