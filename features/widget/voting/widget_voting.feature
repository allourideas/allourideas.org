Feature: Voting
  In order to get preferences from visitors
  A user
  Should be able to interact successfully with the voting screen
  
  Background: 
    Given an idea marketplace quickly exists with url 'test'
    And I am on the WIDGET Cast Votes page for 'test'

    @widget
    @selenium
    Scenario: User has two choices and votes for the left one
      When I click on the left choice 
      Then I should see "You chose" within ".tellmearea"
      And I should see "over" within ".tellmearea"

    @widget
    @selenium
    Scenario: User has two choices and votes for the right one
      When I click on the right choice 
      Then I should see "You chose" within ".tellmearea"
      And I should see "over" within ".tellmearea"
