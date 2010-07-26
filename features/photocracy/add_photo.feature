Feature: Add photo to marketplace
  In order to have photos from the community be considered 
  A user
  Should be able to add their own photo while voting

  Background: 
    Given a photocracy idea marketplace quickly exists with url 'test' and admin 'test@example.com/password'
    And I sign in as "test@example.com/password"
    And I am on the Cast Votes page for 'test'
    And no emails have been sent

    @photocracy
    @selenium
    Scenario: Unmoderated marketplace
      Given idea marketplace 'test' has enabled idea autoactivation
      When I upload a photo
      Then "test@example.com" should receive an email 
      When "test@example.com" opens the email
      Then they should see "[Photocracy] photo added to question: test name" in the email subject
      And they should see "Someone has uploaded a new photo to your question" in the email body
      And they should see "http://photocracy.org/test/choices/" in the email body
      And they should see "Based on your settings, we have auto-activated the photo" in the email body
      When they click the first link in the email
      Then I should see "Activated"

    @photocracy
    @selenium
    Scenario: Moderated marketplace
      When I upload a photo
      Then "test@example.com" should receive an email 
      When "test@example.com" opens the email
      Then they should see "[Photocracy] photo added to question: test name" in the email subject
      And they should see "Someone has uploaded a new photo to your question" in the email body
      And they should see "If you want others to be able to vote on this photo, please activate it by visiting the following url:" in the email body
      When they click the first link in the email
      Then I should see "Deactivated"

      

