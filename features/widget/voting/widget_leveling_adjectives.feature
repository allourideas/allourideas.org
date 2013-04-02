Feature: Leveling Adjectives
	In order to be encouraged to submit more votes
	A user
	Should be presented with encouraging 'leveling' adjectives based on participation on the widget

	Background:
		Given an idea marketplace quickly exists with url 'test'
		And I am on the WIDGET Cast Votes page for 'test'

    @widget
	  @javascript
	  Scenario: User submits a single vote
		  When I click on the left choice
		  Then I should see "Now you have cast 1 vote and added 0 ideas: good" within ".bottom_status"
		  And I should see "You chose" within ".tellmearea"

    @widget
	  @javascript
	  Scenario: User submits a single idea
		  When I upload an idea titled 'blah blah blah'
		  Then I should see "Now you have cast 0 votes and added 1 idea: good" within ".bottom_status"

    @widget
	  @javascript
	  Scenario: User views results in the middle of voting
		  When I click on the left choice
		  Then I should see "Now you have cast 1 vote and added 0 ideas: good" within ".bottom_status"
		  When I go to the View Results page for 'test'
		  And I go to the WIDGET Cast Votes page for 'test'
		  And I click on the left choice
		  Then I should see "Now you have cast 2 votes and added 0 ideas: good" within ".bottom_status"

    @widget	
	  @javascript
	  Scenario Outline: User submits a combination of votes and ideas
		  When I vote on the WIDGET <num_votes> times
		  And I upload <num_ideas> ideas
		  Then I should see "Now you have cast <num_votes> votes and added <num_ideas> ideas: <adjective>" within ".bottom_status"
		  Scenarios: combination
			  |num_votes|num_ideas|adjective|
			  |2| 0| good|
			  |3| 0| nice|
			  |8| 0| amazing|



		

	

