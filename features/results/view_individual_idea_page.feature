Feature: View individual idea page
	In order to learn more about a particular idea
	A user
	Should be able to view an individual idea page
	
	Background: 
		Given an idea marketplace exists with url 'test'
		And idea marketplace 'test' has 10 ideas

	Scenario: User visits idea page
		Given I am on the View Results page for 'test'
		When I follow "Idea #1"
		Then I should see "Idea #1"
		And I should see "Added on"
		And I should see "Score"
		And I should see "50"
		And I should see "Number of Votes"

	Scenario: User visits idea page for flag as inappropriate question
	        Given idea marketplace 'test' has enabled "flag as inappropriate"
		And I am on the View Results page for 'test'
		When I follow "Idea #1"
		Then I should see "Idea #1"
		And I should see "Added on"
		And I should see "Score"
		And I should see "50"
		And I should see "Number of Votes"
		And I should see "0 votes on 12 ideas"
