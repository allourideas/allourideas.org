Feature: About
	In order to understand idea marketplaces and widgets
	As a voter
	I want to be able to read about both of those

	Background: 
		Given an idea marketplace quickly exists with url 'test'
		And idea marketplace 'test' has 20 ideas
    And I am on the WIDGET Cast Votes page for 'test'

    @widget
    @selenium
	  Scenario: User clicks About
		  When I click the WIDGET About tab
      Then I should see "1)" within ".aboutpage"
		  And I should not see ".results_content"
	  	And I should not see ".left_choice_cell"


