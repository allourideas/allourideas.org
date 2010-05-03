Feature: Voting
  In order to get preferences from visitors
  A user
  Should be able to interact successfully with the voting screen
  
  Background: 
    Given an idea marketplace exists with url 'test'
    And I am on the Cast Votes page for 'test'

    @selenium
    Scenario: User has two choices and votes for the left one
      When I click on the left choice 
      Then I should see "You chose" within ".tellmearea"
      And the notification in the tell me area should contain links
      And the vote count should be 1
      And the idea count should be 2 

    @selenium
    Scenario: User has two choices and votes for the right one
      When I click on the right choice 
      Then I should see "You chose" within ".tellmearea"
      And the notification in the tell me area should contain links
      And the vote count should be 1
      And the idea count should be 2 

    @selenium
    Scenario: User has two choices and adds a new one
      When I upload an idea titled 'blah blah blah'
      Then I should see "You just added an idea for people to vote on: blah blah blah" within ".tellmearea"
      Then I should see "Now you have cast 0 votes and added 1 idea" within ".tellmearea"
      And the notification in the tell me area should not contain links
      And the vote count should be 0
      And the idea count should be 2
