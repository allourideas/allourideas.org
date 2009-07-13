Feature: Rails controller generator
  In order to better do Test-Driven Development with Rails
  As a user
  I want to generate Shoulda & Factory Girl tests for only RESTful actions I need.

  Scenario: Functional test generator for index action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" functional test with "index" action
    Then a standard "index" functional test for "posts" should be generated

  Scenario: Functional test generator for new action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" functional test with "new" action
    Then a standard "new" functional test for "posts" should be generated

  Scenario: Functional test generator for create action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" functional test with "create" action
    Then a standard "create" functional test for "posts" should be generated

  Scenario: Functional test generator for create action when Cucumber is installed
    Given a Rails app with Cucumber
    And the coulda plugin is installed
    When I generate a "Posts" functional test with "create" action
    Then a standard "create" functional test for "posts" should be generated

  Scenario: Functional test generator for show action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" functional test with "show" action
    Then a standard "show" functional test for "posts" should be generated

  Scenario: Functional test generator for edit action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" functional test with "edit" action
    Then a standard "edit" functional test for "posts" should be generated

  Scenario: Functional test generator for update action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" functional test with "update" action
    Then a standard "update" functional test for "posts" should be generated

  Scenario: Functional test generator for destroy action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" functional test with "destroy" action
    Then a standard "destroy" functional test for "posts" should be generated

