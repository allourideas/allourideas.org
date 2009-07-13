Feature: Rails controller generator
  In order to better do Test-Driven Development with Rails
  As a user
  I want to generate Shoulda & Factory Girl tests for only RESTful actions I need.

  Scenario: Controller generator for index action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" controller with "index" action
    And an empty "index" controller action for "posts" should be generated

  Scenario: Controller generator for new action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" controller with "new" action
    And a "new" controller action for "posts" should be generated

  Scenario: Controller generator for create action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" controller with "create" action
    And a "create" controller action for "posts" should be generated

  Scenario: Controller generator for create action when Cucumber is installed
    Given a Rails app with Cucumber
    And the coulda plugin is installed
    When I generate a "Posts" controller with "create" action
    And a "create" controller action for "posts" should be generated

  Scenario: Controller generator for show action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" controller with "show" action
    And a "show" controller action for "posts" should be generated

  Scenario: Controller generator for edit action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" controller with "edit" action
    And a "edit" controller action for "posts" should be generated

  Scenario: Controller generator for update action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" controller with "update" action
    And a "update" controller action for "posts" should be generated

  Scenario: Controller generator for destroy action
    Given a Rails app
    And the coulda plugin is installed
    When I generate a "Posts" controller with "destroy" action
    And a "destroy" controller action for "posts" should be generated

