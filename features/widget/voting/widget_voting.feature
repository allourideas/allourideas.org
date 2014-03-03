Feature: Voting
  In order to get preferences from visitors
  A user
  Should be able to interact successfully with the voting screen

  Background:
    Given an idea marketplace quickly exists with url 'test'
    Given an idea marketplace quickly exists with url 'test2'

    @widget
    @javascript
    Scenario: User has two choices and votes for the left one
      When I am on the WIDGET Cast Votes page for 'test'
      And I click on the left choice
      Then I should see "You chose" within ".tellmearea"
      And I should see "over" within ".tellmearea"

    @widget
    @javascript
    Scenario: User has two choices and votes for the right one
      When I am on the WIDGET Cast Votes page for 'test'
      And I click on the right choice
      Then I should see "You chose" within ".tellmearea"
      And I should see "over" within ".tellmearea"

    @widget
    @selenium
    Scenario: User visits page with 2 different widgets embedded on the same page
      When I am on the multiple widgets embedded page
      And I click on the left choice within iframe "widget1"
      Then I should see "You chose" within ".tellmearea" within iframe "widget1"
      And last vote should match session of last earl show for "test"

      When I click on the left choice within iframe "widget2"
      Then I should see "You chose" within ".tellmearea" within iframe "widget2"
      And last vote should match session of last earl show for "test2"

      When I click on the left choice within iframe "widget1"
      Then I should see "You chose" within ".tellmearea" within iframe "widget1"
      And last vote should match session of last earl show for "test"

    @widget
    @selenium
    Scenario: User visits page with 2 of the same widget on the same page
      When I am on the multiple same widgets embedded page
      And I click on the left choice within iframe "widget1"
      Then I should see "You chose" within ".tellmearea" within iframe "widget1"

      When I click on the left choice within iframe "widget2"
      Then I should see "You chose" within ".tellmearea" within iframe "widget2"
      And last vote should not match the session of the previous vote

      When I click on the left choice within iframe "widget1"
      Then I should see "You chose" within ".tellmearea" within iframe "widget1"
      And last vote should not match the session of the previous vote
