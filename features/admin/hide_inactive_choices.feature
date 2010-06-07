Feature: Hide inactive choices
	In order to prevent unwanted choices from being displayed
	As a question administrator
	I should be able to hide choices by deactivating them

	Background:
		Given an idea marketplace quickly exists with url 'test'
		And idea marketplace 'test' has 3 ideas
		And I am on the Cast Votes page for 'test'
		And I save the current two choices

	Scenario: Inactive choices should be hidden from view results
		When I deactivate the saved left choice
		And I go to the View Results page for 'test'
		Then I should not see the saved left choice text
		And I should see the saved right choice text
	
	Scenario: Inactive choices should be shown on question admin page
                Given I sign in as "test@test.com/password"
		When I deactivate the saved left choice
		And I go to the Admin page for 'test'
		Then I should see the saved left choice text
		And I should see the saved right choice text
		And I should see "Deactivated"

