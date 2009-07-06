Feature: Rails view generator
  In order to do Test-Driven Development with Rails
  As a developer
  I want to generate a view to make a functional test pass

  Scenario: View generator for new action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "new" view for "Posts"
    Then a standard "new" view for "posts" should be generated

