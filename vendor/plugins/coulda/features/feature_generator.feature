Feature: Rails controller generator
  In order to better do Test-Driven Development with Rails
  As a user
  I want to generate Shoulda & Factory Girl tests for only RESTful actions I need.

  Scenario: Feature generator for new action
    Given a Rails app with Cucumber
    And the coulda plugin is installed
    When I generate a "new" feature for "Posts"
    Then a "posts" feature for the "create" scenario should be generated
    And a "posts" step definition should be generated
    And a new post page path should be generated

  Scenario: Feature generator for create action same as new
    Given a Rails app with Cucumber
    And the coulda plugin is installed
    When I generate a "create" feature for "Posts"
    Then a "posts" feature for the "create" scenario should be generated
    And a "posts" step definition should be generated
    And a new post page path should be generated

