Feature: Cant Decide Feature

  Background: 
    Given an idea marketplace exists with admin 'test@dkapadia.com' and password 'blah' and url 'test'
    And I sign in as "test@dkapadia.com/blah"
    And I am on the Admin page for 'test'

	Scenario: cant decide defaults to on
	  When I go to the Cast Votes page for 'test'
	  Then I should see "I can't decide" within ".question-vote"

	Scenario: I disable cant decide
	  When I uncheck "earl_show_cant_decide"
	  And I press "Save"
	  And I go to the Cast Votes page for 'test'
	  Then I should not see "I can't decide" within ".question-vote"

  @widget
	Scenario: cant decide defaults to on
	  When I go to the Cast Votes page for 'test'
	  Then I should see "I can't decide" within ".votebox"

  @widget
	Scenario: I disable cant decide
	  When I uncheck "earl_show_cant_decide"
	  And I press "Save"
	  And I go to the Cast Votes page for 'test'
	  Then I should not see "I can't decide" within ".votebox"
