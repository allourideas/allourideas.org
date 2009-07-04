Feature: Rails controller generator
  In order to better do Test-Driven Development with Rails
  As a user
  I want to generate Shoulda & Factory Girl tests for only RESTful actions I need.

  Scenario: View generator for new action when Cucumber is installed
    Given a Rails app with Cucumber
    And the coulda plugin is installed
    When I generate a "new" view for "Posts"
    Then a standard "new" view for "posts" should be generated
    And a standard "posts" feature for the "new" scenario should be generated

