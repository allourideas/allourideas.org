Feature: Leveling Adjectives
	In order to be encouraged to submit more votes
	A user
	Should be presented with encouraging 'leveling' adjectives based on participation

	Background:
		Given an idea marketplace exists with url 'test'
		And I am on the Cast Votes page for 'test'

	@selenium
	Scenario: User submits a single vote
		When I click on the left choice
		Then I should see "Now you have cast 1 vote and added 0 ideas: terrible" within ".tellmearea"
		And I should see "You chose" within ".tellmearea"

	@selenium
	Scenario: User submits a single idea
		When I upload an idea titled 'blah blah blah'
		Then I should see "Now you have cast 0 votes and added 1 idea: terrible" within ".tellmearea"
        @focus
	@selenium
	Scenario: User views results in the middle of voting
		When I click on the left choice
		And I go to the View Results page for 'test'
		And I go to the Cast Votes page for 'test'
		And I click on the left choice
		Then I should see "Now you have cast 2 votes and added 0 ideas: terrible" within ".tellmearea"
		

	

