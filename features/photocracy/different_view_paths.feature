Feature: Change view paths for photocracy
  In order to keep the AOI and Photocracy codebase manageable
  Both applications shares controller and model code (with different views)
  The site's behavior is determined by the photocracy_filter 
  Currently this before_filter just looks for "photocracy" in the request.url
  
  @photocracy
  Scenario: User visits photocracy.org
    When I go to the homepage
    Then I should see "Photocracy"
    And show me the page
  
  Scenario: User visits allourideas.org
    Given I am on the homepage
    Then I should not see "Photocracy"
    And show me the page
