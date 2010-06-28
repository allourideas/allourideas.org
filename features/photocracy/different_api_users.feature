Feature: Different api users
  In order to keep the AOI and Photocracy API data separated
  Requests made to Photocracy should result in different credentials being sent to the API
	
    Scenario: User votes on a photocracy page
      Given I am in photocracy mode
      And a photocracy idea marketplace quickly exists with url 'princeton'
      When I go to the Cast Votes page for 'princeton'
      Then show me the page

    Scenario: User votes on an allourideas page
      Given an idea marketplace quickly exists with url 'test'
      And I am in photocracy mode
      When I go to the Cast Votes page for 'test'
      Then show me the page
