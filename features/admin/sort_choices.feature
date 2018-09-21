Feature: Sorting choices
  In order to manage their view of the choices
  A question administrator
  Should be able to sort the choices by the header columns

  Background:
    Given an idea marketplace quickly exists with url 'test' and 4 ideas
    And I sign in as the admin for 'test'
    And I am on the Admin page for 'test'

  @javascript
  Scenario: User sorts status column
    When I click on the toggle link for the first choice
    Then the first choice should be Deactivated
    And I click on the Status header column
    Then the first choice should be Activated
    And I click on the Status header column
    Then the first choice should be Deactivated
