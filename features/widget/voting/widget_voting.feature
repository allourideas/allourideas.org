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
    Scenario: User visits page with 2 different widgets embedded on the same page
      Given skip this scenario due ActiveRecord::StatementInvalid: SQLite3::BusyException: database is locked
      When I am on the multiple widgets embedded page
      And switch to frame "widget1"
      And I click on the left choice
      Then I should see "You chose" within ".tellmearea"
      And switch to top document
      And last vote should match session of last earl show for "test"
      Then remember session_info_id of the previous vote as "widget1_vote1_session"

      And switch to frame "widget2"
      When I click on the left choice
      Then I should see "You chose" within ".tellmearea"
      And switch to top document
      And last vote should match session of last earl show for "test2"
      Then remember session_info_id of the previous vote as "widget2_vote1_session"
      And remembered "widget2_vote1_session" should not equal "widget1_vote1_session"

      And switch to frame "widget1"
      When I click on the left choice within
      Then I should see "You chose" within ".tellmearea"
      And switch to top document
      And last vote should match session of last earl show for "test"
      Then remember session_info_id of the previous vote as "widget1_vote2_session"
      And remembered "widget1_vote1_session" should equal "widget1_vote2_session"

    @widget
    Scenario: User visits page with 2 different widgets embedded on the same page and reloads part way through
      Given skip this scenario due ActiveRecord::StatementInvalid: SQLite3::BusyException: database is locked
      When I am on the multiple widgets embedded page
      And switch to frame "widget1"
      And I click on the left choice
      Then I should see "You chose" within ".tellmearea"
      And switch to top document
      And last vote should match session of last earl show for "test"
      Then remember session_info_id of the previous vote as "widget1_vote1_session"

      And switch to frame "widget2"
      When I click on the left choice
      Then I should see "You chose" within ".tellmearea"
      And switch to top document
      And last vote should match session of last earl show for "test2"
      Then remember session_info_id of the previous vote as "widget2_vote1_session"
      And remembered "widget2_vote1_session" should not equal "widget1_vote1_session"

      # reload page
      When I am on the multiple widgets embedded page

      And switch to frame "widget1"
      When I click on the left choice
      Then I should see "You chose" within ".tellmearea"
      And switch to top document
      And last vote should match session of last earl show for "test"
      Then remember session_info_id of the previous vote as "widget1_vote2_session"
      And remembered "widget1_vote1_session" should equal "widget1_vote2_session"

      And switch to frame "widget2"
      When I click on the left choice
      Then I should see "You chose" within ".tellmearea"
      And switch to top document
      And last vote should match session of last earl show for "test2"
      Then remember session_info_id of the previous vote as "widget2_vote2_session"
      And remembered "widget2_vote1_session" should equal "widget2_vote2_session"

    @widget
    Scenario: User visits page with 2 of the same widget on the same page
      Given skip this scenario due ActiveRecord::StatementInvalid: SQLite3::BusyException: database is locked
      When I am on the multiple same widgets embedded page
      And switch to frame "widget1"
      And I click on the left choice
      Then I should see "You chose" within ".tellmearea"
      And switch to top document
      Then remember session_info_id of the previous vote as "widget1_vote1_session"

      And switch to frame "widget2"
      When I click on the left choice
      Then I should see "You chose" within ".tellmearea"
      And switch to top document
      Then remember session_info_id of the previous vote as "widget2_vote1_session"
      And remembered "widget2_vote1_session" should not equal "widget1_vote1_session"

      And switch to frame "widget1"
      When I click on the left choice
      Then I should see "You chose" within ".tellmearea"
      And switch to top document
      Then remember session_info_id of the previous vote as "widget1_vote2_session"
      And remembered "widget1_vote1_session" should equal "widget1_vote2_session"

      And switch to frame "widget2"
      When I click on the left choice
      Then I should see "You chose" within ".tellmearea"
      And switch to top document
      Then remember session_info_id of the previous vote as "widget2_vote2_session"
      And remembered "widget2_vote1_session" should equal "widget2_vote2_session"

    @widget
    Scenario: User visits page with 2 of the same widget on the same page and reloads
      When I am on the multiple same widgets embedded page
      # reload page
      When I am on the multiple same widgets embedded page
      And switch to frame "widget1"
      And I click on the left choice
      Then I should see "You chose" within ".tellmearea"
      And switch to top document

      And switch to frame "widget2"
      When I click on the left choice within
      And switch to top document
      Then I should see "Sorry, your vote wasn't counted" within ".tellmearea" within iframe "widget2"
