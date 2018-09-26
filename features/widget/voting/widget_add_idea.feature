Feature: Add idea to marketplace
  In order to have ideas from the community be considered
  A user
  Should be able to add their own idea while voting on a widget

  Background:
    Given an idea marketplace quickly exists with url 'test'
    And I am on the WIDGET Cast Votes page for 'test'

    @widget
    @javascript
    Scenario: Adding choice to unmoderated marketplace
      Given idea marketplace 'test' has enabled idea autoactivation
      When I upload an idea titled 'blah blah blah'
      Then I should see "Your idea has been submitted for review. It will appear soon." within ".tellmearea"
      And admin activates last idea of "test"
      When I go to the View Results page for 'test'
      Then I should see "blah blah blah"

    @widget
    @javascript
    Scenario: Adding choice to moderated marketplace
      When I upload an idea titled 'blah blah blah'
      Then I should see "Your idea has been submitted for review. It will appear soon." within ".tellmearea"
      When I go to the View Results page for 'test'
      Then I should not see "blah blah blah"
      When I sign in as the admin for 'test'
      And I go to the Admin Page for 'test'
      Then I should see "blah blah blah"

