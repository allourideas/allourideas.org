Feature: Tabbed vote header
 In order to help navigate the site
 A user
 Should see a 'tabbed' vote header to denote current page

  Scenario: Check that urls are being generated correctly
     Given an idea marketplace quickly exists with url 'test'
     And I am on the Cast Votes page for 'test'
     When I follow "View Results"
     Then I should be on the View Results page for 'test'
