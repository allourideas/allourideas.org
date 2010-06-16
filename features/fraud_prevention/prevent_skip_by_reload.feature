Feature: Prevent skip by reloading the page
  In order to prevent fraud by selective voting
  A user
  Should be prevented from skipping by reloading the page
 
	Background: 
	    Given an idea marketplace quickly exists with url 'test' and 30 ideas
	    And I am on the Cast Votes page for 'test'
	    And I save the current two choices
		
 
	Scenario: User reloads page to try to skip
		When I go to the Cast Votes page for 'test' # effectively reloads page
		Then the left choice text should match the saved left choice text
		And the right choice text should match the saved right choice text
	
        Scenario: User attempts to skip by visiting other pages 
		When I go to the View Results page for 'test'
		And I go to the Cast Votes page for 'test'
		Then the left choice text should match the saved left choice text
		And the right choice text should match the saved right choice text
	
	Scenario: User's last prompt becomes deactivated
		When I deactivate the saved left choice
		And I go to the Cast Votes page for 'test' 
		Then the left choice text should not match the saved left choice text
		When I save the current two choices
		And I go to the Cast Votes page for 'test' # effectively reloads page
		Then the left choice text should match the saved left choice text
		And the right choice text should match the saved right choice text
 
 
