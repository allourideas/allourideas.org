Feature: Activating and deactivating choices
   In order to prevent unwanted choices from appearing
   As a question admin
   I should be able to activate and deactivate a choice

	Background: 
	  Given an idea marketplace quickly exists with url 'test' and 5 ideas
	  And I am on the Cast Votes page for 'test'
	  And I save the current two choices
    And I sign in as the admin for 'test'

	Scenario: Activate
	  When I deactivate the saved left choice
	  And I go to the Activate page for the saved left choice
	  Then I should see "You have successfully activated" 
	  When I go to the View Results page for 'test'
	  Then I should see the saved left choice text

	Scenario: Deactivate
	  When I go to the Deactivate page for the saved left choice
	  Then I should see "You have successfully deactivated" 
	  When I go to the View Results page for 'test'
	  Then I should not see the saved left choice text
