Feature: Voting
  In order to get preferences from visitors
  A user
  Should be able to interact successfully with the voting screen

    Scenario: User has two choices and votes for the left one
      Given I am on the question show page
      And the vote count is 20
      And the idea count is 30
      When I click on the left prompt
      Then I should see "Vote was successfully counted." in the tell me area
      And the notification in the tell me area should contain links
      And the notification in the tell me area should contain link to the winner
      And the notification in the tell me area should contain link to the loser
      And the vote count should be 21
      And the idea count should be 30

    Scenario: User has two choices and votes for the right one
      Given I am on the question show page
      And the vote count is 20
      And the idea count is 30
      When I click on the right prompt
      Then I should see "Vote was successfully counted." in the tell me area
      And the notification in the tell me area should contain link to the winner
      And the notification in the tell me area should contain link to the loser
      And the vote count should be 21
      And the idea count should be 30

    Scenario: User has two choices and adds a new one
      Given I am on the question show page
      And the vote count is 20
      And the idea count is 30
      When I fill in the idea box with "Give all students a free ZipCar membership"
      Then I should see "You just added an idea for people to vote on: Give all students a free ZipCar membership" in the tell me area
      And the notification in the tell me area should contain a link to the new idea
      And the vote count should be 20
      And the idea count should be 31