Feature: View individual idea page
	In order to learn more about a particular idea
	A user
	Should be able to view an individual idea page
	
	Background: 
		Given an idea marketplace quickly exists with url 'test' and 4 ideas

	Scenario: User visits idea page
		Given I am on the View Results page for 'test'
		When I follow "Idea #1"
		Then I should see "Idea #1"
		And I should see "Added on"
		And I should see "Score"
		And I should see "50"
		And I should see "Completed Contests"

	Scenario: User visits idea page for flag as inappropriate question
	        Given idea marketplace 'test' has enabled "flag as inappropriate"
		And I am on the View Results page for 'test'
		When I follow "Idea #1"
		Then I should see "Idea #1"
		And I should see "Added on"
		And I should see "Score"
		And I should see "50"
		And I should see "Completed Contests"
	
	@javascript
	Scenario: Voting updates individual choice total correctly
		Given I am on the Cast Votes page for 'test'
		And I save the current two choices
      		When I click on the left choice 
		And I deactivate the two saved choices
		And I go to the Cast Votes page for 'test'
		And I vote 10 times
		Then the vote count should be 11
		When I go to the Idea Detail page for the saved left choice
		Then I should see "1" within "#num_votes"
		When I go to the Idea Detail page for the saved right choice
		Then I should see "1" within "#num_votes"

	@javascript
	Scenario: Voting updates individual choice total correctly on flag as inappropriate
	        Given idea marketplace 'test' has enabled "flag as inappropriate"
		And I am on the Cast Votes page for 'test'
		And I save the current two choices
      		When I click on the left choice 
		And I deactivate the two saved choices
		And I go to the Cast Votes page for 'test'
		And I vote 10 times
		Then the vote count should be 11
		When I go to the Idea Detail page for the saved left choice
		And I should see "1" within "#num_votes"
		When I go to the Idea Detail page for the saved right choice
		Then I should see "1" within "#num_votes"
