Feature: Rails view generator
  In order to do Test-Driven Development with Rails
  As a developer
  I want to generate a view to make a functional test pass

  Scenario: View generator for new action
    Given a Rails app
    And the blitz plugin is installed
    When I generate a "new" view for "Posts"
    Then a SemiFormal "new" view for "posts" should be generated

  Scenario: View generator for new action
    Given a Rails app
    And the blitz plugin is installed
    When I generate a Post model with title, body, and User
    And I generate a "new" view for "Posts"
    Then a SemiFormal "new" view for "posts" should be generated with fields

  Scenario: View generator for new action
    Given a Rails app
    And the blitz plugin is installed
    When I generate a Post model with title, body, and User
    And I generate a "new" view for "Posts" with the empty option
    Then an empty "new" view for "posts" should be generated

  Scenario: View generator for index action
    Given a Rails app
    And the blitz plugin is installed
    When I generate a "index" view for "Posts"
    Then a non-model-reflected "index" view for "posts" should be generated

  Scenario: View generator for index action
    Given a Rails app
    And the blitz plugin is installed
    When I generate a Post model with title, body, and User
    And I generate a "index" view for "Posts"
    Then a model-reflected "index" view for "posts" should be generated

