Feature: View Results
	In order to be motivated to engage in this idea marketplace
	As a voter
	I want to be able to see current results on the widget

	Background: 
		Given an idea marketplace quickly exists with url 'test'
		And idea marketplace 'test' has 20 ideas
    And I am on the WIDGET Cast Votes page for 'test'

    @widget
    @selenium
	  Scenario: User clicks all results
		  When I click the WIDGET View Results tab
		  Then I should see "View More Results" within ".bottom_status"
      And I should not see ".left_choice_cell"
      And I should not see ".aboutpage"
	  	And I should not see "See more..."

