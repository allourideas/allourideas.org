Feature: Tabbed vote header
 In order to help navigate the site
 A user
 Should see a 'tabbed' vote header to denote current page

  Scenario: Check that urls are being generated correctly
     Given an idea marketplace quickly exists with url 'test'
     And I am on the Cast Votes page for 'test'
     When I follow "View Results"
     Then I should be on the View Results page for 'test'

  Scenario: Check that view results does not show up in tabs when hidden
     Given an idea marketplace quickly exists with url 'test'
     And idea marketplace 'test' has results hidden
     And I am on the Cast Votes page for 'test'
     Then I should not see "View Results" within ".vote-tabs"

  Scenario: Admin should see "View Results" tab even when results are hidden
     Given an idea marketplace quickly exists with url 'test'
     And idea marketplace 'test' has results hidden
     And I sign in as the admin for 'test'
     And I am on the Cast Votes page for 'test'
     Then I should see "View Results" within ".vote-tabs"
