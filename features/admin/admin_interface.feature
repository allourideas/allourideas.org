Feature: Admin Interface
  In order to make question administration easy
  A question administrator
  Should expect certain things on the admin interface

  Background:
    Given an idea marketplace exists with admin 'test@dkapadia.com' and password 'blah' and url 'test'
    And I sign in as "test@dkapadia.com/blah"
    And I am on the Admin page for 'test'

  Scenario: Admin should see their email
    Then I should see " and it is registered to: test@dkapadia.com"

