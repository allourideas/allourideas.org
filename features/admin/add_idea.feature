Feature: Add Idea Toggle

  Background:
    Given an idea marketplace exists with admin 'test@dkapadia.com' and password 'blah' and url 'test'
    And I sign in as "test@dkapadia.com/blah"
    And I am on the Admin page for 'test'

  Scenario: add idea box defaults to on
    Given skip this scenario as no submit button for add idea
    When I go to the Cast Votes page for 'test'
    Then I should see "Submit" within ".add_idea"

  Scenario: I disable cant decide
    When I uncheck "earl_show_add_new_idea"
    And I press "Save"
    And I go to the Cast Votes page for 'test'
    Then I should not see "Submit" within ".question-vote"

  @widget
  Scenario: cant decide defaults to on
    When I go to the WIDGET Cast Votes page for 'test'
    Then I should see "Add your own idea" within ".add_container"

  @widget
  Scenario: I disable cant decide
    When I uncheck "earl_show_add_new_idea"
    And I press "Save"
    And I go to the WIDGET Cast Votes page for 'test'
    Then I should not see "Add your own idea" within ".add_container"
