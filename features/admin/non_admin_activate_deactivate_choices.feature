Feature: Non-admins should not be able to deactivate choices
   Only admins should have the ability to deactivate choices

  Background:
    Given an idea marketplace quickly exists with url 'test' and 5 ideas
    And I am on the Cast Votes page for 'test'
    And I save the current two choices

  Scenario: Not logged in
    When I go to the Deactivate page for the saved left choice
    Then I should be on the sign in page

  Scenario: Logged in as nonowner
    When I have signed in with "nonowner@example.com/password"
    Then I should see "nonowner@example.com"
    When I go to the Deactivate page for the saved left choice
    Then I should see "You do not have permission to modify this wiki survey"
