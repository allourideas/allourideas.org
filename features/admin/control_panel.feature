Feature: Control Panel
  In order to easily manage more than one question
  As a question administrator, or site administrator
  I should be able to access a site wide control panel

  Background:
  Given an idea marketplace quickly exists with question title 'Which animal is strongest?' and admin 'blah@blah.com/test'
  And an idea marketplace quickly exists with question title 'What adjective is better?' and admin 'other@blah.com/test'

  Scenario: User is not signed in
    When I go to the Control Panel page
    Then I should see "Log in to your account"
    And I should be on the sign in page

  Scenario: User is signed in
    Given I sign in as "blah@blah.com/test"
    When I go to the Control Panel page
    Then I should see "Which animal is strongest?"
    And I should not see "What adjective is better?"
    And I should not see "Active User Ideas"
    When I follow "Which animal is strongest?"
    Then I should see "Which animal is strongest?"

  Scenario: User is a super admin
    Given skip this scenario as jquery.tablesorter.min gives JS error on phantomjs
    Given an idea marketplace quickly exists with question title 'Which super admin is best?' and admin 'super@admin.com/blah'
    And a super admin user exists with credentials "admin@admin.com/blah"
    And I sign in as "admin@admin.com/blah"
    When I go to the Control Panel All page
    Then I should see "Which animal is strongest?"
    And I should see "What adjective is better?"
    And I should see "Which super admin is best?"
    And I should see "Active User Ideas"
    When I follow "What adjective is better?"
    Then I should see "What adjective is better?"
