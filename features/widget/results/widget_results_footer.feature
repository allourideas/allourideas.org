Feature: 'Bottom Status' Footer on Results tab
  In order to help navigate the widget
  A user viewing the View Results tab
  Should see a 'Bottom Status' Footer to link to other pages

  # Note that this does not test that a new page is actually opening, and that it's actually the view results page.
  # Not possible in capybara right now. http://groups.google.com/group/ruby-capybara/browse_thread/thread/b809c68afb80f7ab
  # Should think of a way to do this.
  #
  # 7/21 note: I've decided to comment this out for now. The "View Results" page popup just tends to linger, which is annoying.
  #@widget
  #@selenium
  #Scenario: Check that the link to the full results page works
    #Given an idea marketplace quickly exists with url 'test'
    #And I am on the WIDGET Cast Votes page for 'test'
    #When I click the WIDGET View Results tab
    #And I follow "View More Results" within ".bottom_status"
    #Then I should remain on the WIDGET View Results tab
    # Note above: You remain on the widget view results tab because view more results opens in a new window.

  @widget
  @selenium
  Scenario: Check that the "link" back to the Cast Votes page works
    Given an idea marketplace quickly exists with url 'test'
    And I am on the WIDGET Cast Votes page for 'test'
    When I click the WIDGET View Results tab
    And I follow "Return to Voting" within ".bottom_status"
    Then I should have switched to and be on the WIDGET Cast Votes tab
