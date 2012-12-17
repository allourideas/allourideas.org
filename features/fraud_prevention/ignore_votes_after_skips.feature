Feature: Ignore votes immediately after skips
  In order to prevent fraud by selective voting
  A user
  Should have their votes immediately after a skip marked invalid

  Background: 
    Given an idea marketplace quickly exists with url 'test'
    And I am on the Cast Votes page for 'test'
  
  @javascript
  Scenario: Votes should appear counted, but not actually count
    When I click the I can't decide button
    And I pick "I like both ideas"
    And the vote count should be 0
    When I click on the left choice 
    Then the vote count should be 1
    When I go to the Cast Votes page for 'test'
    Then the vote count should be 0
    When I go to the View Results page for 'test'
    Then I should see "50"
    And I should not see "67"
    And I should not see "66"
    And I should not see "33"
