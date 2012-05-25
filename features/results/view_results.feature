Feature: View Results
	In order to be motivated to engage in this idea marketplace
	As a voter
	I want to be able to see current results

	Background: 
		Given an idea marketplace quickly exists with url 'test'
		And idea marketplace 'test' has 20 ideas

	Scenario: User clicks all results
		Given I am on the View Results page for 'test'
		When I follow "»"
		Then I should not see "Idea #001"
		And I should see "Idea #011"
		And I should have the following query string:
		   |page|2|
         
	Scenario: User clicks all results in french
		Given the default locale for 'test' is 'fr'
		And I am on the View Results page for 'test'
		When I follow "»"
		Then I should not see "Idea #001"
		And show me the page
		And I should see "Idea #011"
		And I should have the following query string:
		   |page|2|
		   |locale|fr|



