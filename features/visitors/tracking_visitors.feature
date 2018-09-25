Feature: Tracking Visitors
   In order to keep accurate statistics about users that return to our site
   A visitor to this site that engages in multiple sessions
   Should have their activity grouped by actual visitor

  Background:
    Given an idea marketplace quickly exists with url 'test' and 4 ideas
    And there are no User Sessions
    And there are no Visitors

  Scenario: User visits site for the first time
    When I go to the Cast Votes page for 'test'
    And I go to the View Results page for 'test'
    Then there should be 1 User Session
    And there should be 1 Visitor

  Scenario: User visits site once and then returns after 10 minutes
    When I go to the Cast Votes page for 'test'
    And 11 minutes pass
    And I go to the View Results page for 'test'
    Then there should be 2 User Sessions
    And there should be 1 Visitor
