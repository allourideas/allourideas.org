Feature: View Results
	In order to be motivated to engage in this idea marketplace
	As a voter
	I want to be able to see current results

	Background: 
		Given an idea marketplace exists with url 'test'
		And idea marketplace 'test' has 20 ideas

	Scenario: User clicks all results
		Given I am on the View Results page for 'test'
		When I follow "See more..."
		Then I should see "Idea #1"
		And I should see "Idea #19"
		And I should not see "See more..."
		And I should have the following query string:
		   |more|true|
         
	Scenario: User clicks all results in french
		Given the default locale for 'test' is 'fr'
		And I am on the View Results page for 'test'
		When I follow "Voir plus"
		Then I should see "Idea #1"
		And show me the page
		And I should see "Idea #19"
		And I should not see "Voir plus"
		And I should have the following query string:
		   |more|true|
		   |locale|fr|



