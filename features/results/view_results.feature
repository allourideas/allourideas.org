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

  Scenario: A user should not be allowed to see the view results page if hidden
     Given an idea marketplace quickly exists with url 'test'
     And idea marketplace 'test' has results hidden
     Given I am on the View Results page for 'test'
     Then I should see "The results from this wiki survey are only visible to the person who created it."

  Scenario: An admin should be allowed to see the view results page if hidden
     Given an idea marketplace quickly exists with url 'test'
     And idea marketplace 'test' has results hidden
     And I sign in as the admin for 'test'
     Given I am on the View Results page for 'test'
     Then I should not see "The results from this wiki survey are only visible to the person who created it."
     And I should see "Ideas" within ".ideas-table"
