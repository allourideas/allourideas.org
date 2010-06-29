Feature: Tracking Sessions
   In order to keep accurate statistics about the popularity of this website
   A visitor to this site
   Should have their activity recorded by creating sessions

   Background:
	Given an idea marketplace quickly exists with url 'test' and 4 ideas
	And there are no User Sessions
	
   Scenario: User visits site for the first time
	When I go to the Cast Votes page for 'test'
	And I go to the View Results page for 'test'
	Then there should be 1 User Session

   Scenario: User visits site once and then returns within 10 minutes
	When I go to the Cast Votes page for 'test'
	And 9 minutes pass
	And I go to the View Results page for 'test'
	Then there should be 1 User Session

   Scenario: User visits site once and then returns after 10 minutes
	When I go to the Cast Votes page for 'test'
	And 11 minutes pass
	And I go to the View Results page for 'test'
	Then there should be 2 User Sessions
   
   Scenario: User visits site several time within 10 minutes
	When I go to the Cast Votes page for 'test'
	And 5 minutes pass
	And I go to the View Results page for 'test'
	And 2 minutes pass
	And I go to the Cast Votes page for 'test'
	And 5 minutes pass
	Then there should be 1 User Session
