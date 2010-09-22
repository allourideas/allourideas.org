Feature: Owner adds a photo to marketplace

  Background:
    Given a photocracy idea marketplace quickly exists with url 'test' and admin 'test@example.com/password'
    And I sign in as "test@example.com/password"
    And no emails have been sent

    @photocracy
    Scenario: Upload file too big
      Given I am on the Owner Add Photos page for 'test'
      And I upload a photo that is too large
      Then the upload should fail

    @photocracy
    Scenario: Upload file
      Given I am on the Owner Add Photos page for 'test'
      And I upload a photo that is not too large
      Then the upload should succeed 
