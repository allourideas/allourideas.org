Feature: Voting
  In order to get preferences from visitors
  A user
  Should be able to interact successfully with the voting screen
  
  Background: 
    Given an idea marketplace quickly exists with url 'test'
    And I am on the Cast Votes page for 'test'

    @javascript
    Scenario: User has two choices and votes for the left one
      When I click on the left choice 
      Then the vote count should be 1
      And the idea count should be 2 

    @javascript
    Scenario: User has two choices and votes for the right one
      When I click on the right choice 
      Then the vote count should be 1
      And the idea count should be 2 

