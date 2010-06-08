Feature: Logged in users should not be prompted to create an account
  In order to encourage lots of market place creation
  As a question administrator
  I should not be prompted to create a user account when creating a marketplace

	Scenario: Not logged in
		When I go to the question create page
		Then I should see "Step 4: Create an Account"
		And I should see "Step 5 [Optional]: Help Us Out"
		
	Scenario: Logged In
	        Given I have signed in with "test@example.com/password"
		When I go to the question create page
		Then I should not see "Step 4: Create an Account"
		And I should see "Step 4 [Optional]: Help Us Out"
