Feature: Flag as inappropriate
	In order to prevent unsavory materials from being displayed on our site
	A user
	Should be able to flag a choice as inappropriate


	Background: 
		Given an idea marketplace exists with admin 'flag_test@test.com' and url 'test' and 5 ideas
	  And idea marketplace 'test' has enabled "flag as inappropriate"
		And I am on the WIDGET Cast Votes page for 'test'
		And I save the current left choice
		And no emails have been sent

  @widget2
	@selenium
	Scenario: User flags choice as inappropriate
		When I click the flag link for the left choice
		Then I should see "Please explain why this choice is inappropriate: "

  # This is flagging the wrong thing as inappropriate, for some reason. There's nothing wrong with "And the saved left choice should not be active" I think. For some reason the wrong choice is being marked inappropriate, though.
  @widget23
	@selenium
	Scenario: User submits a flag request
		When I click the flag link for the left choice
		And I fill in "new_flag_field" with "Because it's offensive"
		And I click the widget flag submit button
		Then I should see "You flagged a choice as inappropriate." within ".tellmearea"
    # I have no idea why the below line doesn't work properly. I've decided to test whether the idea is deactivated differently with the results page.
		And the saved left choice should not be active
		And "flag_test@test.com" should receive an email 
		When "flag_test@test.com" opens the email
		Then they should see "[All Our Ideas] Possible inappropriate idea flagged by user" in the email subject
		And they should see "Because it's offensive" in the email body
    #When I go to the View Results page for 'test'
    #Given I am on the View Results page for 'test'
    #Then I should not see the saved left choice
    #And show me the page

  @widget2
	@selenium
	Scenario: User clicks flag link but does not type in an answer
		When I click the flag link for the left choice
		And I click the widget flag submit button
		Then I should not see "You flagged a choice as inappropriate."

  @widget2		
	@selenium
	Scenario: User flags all but one choices in marketplace
		Given an idea marketplace exists with admin 'flag_test2@test.com' and url 'test_2' and 2 ideas
	  And idea marketplace 'test_2' has enabled "flag as inappropriate"
		And I am on the WIDGET Cast Votes page for 'test_2'
		And no emails have been sent
		When I click the flag link for the left choice
		And I fill in "new_flag_field" with "Because it's offensive"
		And I click the widget flag submit button
		Then I should see "You flagged an idea as inappropriate. We have deactivated this idea temporarily and sent a notification to the idea marketplace owner. Currently, this idea marketplace does not have enough active ideas. Please contact the owner of this marketplace to resolve this situation"
		And I should be on the homepage
		And "flag_test2@test.com" should receive an email 
		When I go to the Cast Votes page for 'test_2'
		Then I should see "This idea marketplace does not have enough active ideas. Please contact the owner of this marketplace to resolve this situation"
		And I should be on the homepage
