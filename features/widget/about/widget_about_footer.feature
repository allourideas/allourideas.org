Feature: 'Bottom Status' Footer on About tab
  In order to help navigate the widget
  A user viewing the About tab
  Should see a 'Bottom Status' Footer to link to the Cast Votes tab

  @widget
  @javascript
  Scenario: Check that the "link" back to the Cast Votes page works
    Given an idea marketplace quickly exists with url 'test'
    And I am on the WIDGET Cast Votes page for 'test'
    When I click the WIDGET About tab
    And I follow "Return to Voting" within ".bottom_status"
    Then I should have switched to and be on the WIDGET Cast Votes tab
