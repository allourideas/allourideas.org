@photocracy
@selenium
@focus
Feature: Flag as inappropriate
	In order to prevent unsavory materials from being displayed on our site
	A user
	Should be able to flag a photo as inappropriate


	Background: 
          Given a photocracy idea marketplace quickly exists with url 'test' and admin 'test@example.com/password'
	  And idea marketplace 'test' has enabled "flag as inappropriate"
          And I am on the Cast Votes page for 'test'
          And I save the current two photos
	  And no emails have been sent

	Scenario: User submits a flag request
	   When I click the flag link for the left choice
           And I fill in "inappropriate_reason" with "Because it's offensive"
           And I click the photocracy flag submit button
           Then I should not see thumbnails of the two saved choices in the voting history area
	   Then the saved left choice should not be active
	   And "test@example.com" should receive an email 
	   When "test@example.com" opens the email
	   Then they should see "[Photocracy] Possible inappropriate photo flagged by user" in the email subject
	   And they should see "Because it's offensive" in the email body
