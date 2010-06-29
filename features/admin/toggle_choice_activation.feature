Feature: Toggling choice activation
   In order to show users only choices of our choosing
   A question administrator
   Should be able to activate and deactivate choices

   Background:
	Given an idea marketplace quickly exists with url 'test' and 4 ideas
        And I sign in as the admin for 'test'
        And I am on the Admin page for 'test'

	@selenium
	Scenario: User deactivates an active choice
	     When I click on the toggle link for the first choice
	     Then the first choice should be Deactivated

	@selenium
	Scenario: User activates a deactivated choice
	        When I click on the toggle link for the first choice
		And I click on the toggle link for the first choice
		Then the first choice should be Activated
		And I should not see "Deactivated" within ".toggle_choice_status"
