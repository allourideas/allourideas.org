Feature: Change view paths for widget
  In order to keep the AOI and widget codebase manageable
  Both applications shares controller and model code (with different views)
  The site's behavior is determined by the widget_filter
  Currently this before_filter just looks for "widget" in the request.url

  Background: 
    Given an idea marketplace quickly exists with url 'test'

    @widget
    Scenario: User visits http://widget.allourideas.org/test?width=450&height=410
      Given I am on the WIDGET Cast Votes page for 'test'
      Then I should not see "Log in"

    @widget
    Scenario: User visits allourideas.org/test
      Given I am on the Cast Votes page for 'test'
      Then I should see "Log In"
