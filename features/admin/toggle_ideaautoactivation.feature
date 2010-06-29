Feature: Toggling question idea auto activation
   In order to allow question administrators to moderate choices
   A question administrator
   Should be able to enable and disable idea autoactivation

   Background:
	Given an idea marketplace quickly exists with url 'test' and 4 ideas
        And I sign in as the admin for 'test'
        And I am on the Admin page for 'test'

	@selenium
	Scenario: User enables idea autoactivation
	     When I click the idea auto activation toggle button
	     Then I should see "Enabled" within ".toggle_autoactivate_status"

	@selenium
	Scenario: User disables idea autoactivation
	     When I click the idea auto activation toggle button
	     Then I should see "Enabled" within ".toggle_autoactivate_status"
	     When I click the idea auto activation toggle button
	     Then I should see "Disabled" within ".toggle_autoactivate_status"
