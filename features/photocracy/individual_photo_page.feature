Feature: View individual photo page
   In order to learn more about a particular photo
   A user
   Should be able to view an individual photo page

   Background: 
      Given a photocracy idea marketplace quickly exists with url 'test' and admin 'test@example.com/password'
      And I am on the Cast Votes page for 'test'
      Given I save the current two choices
   
   @photocracy
   Scenario: User goes to idea page
      When I go to the Idea Detail page for the saved left choice
      Then I should see "ADDED ON"
      And I should see "SCORE"
      And I should see "NUMBER OF VOTES"
      And I should see "Back to voting"
      And I should not see "Activated"


   @photocracy
   Scenario: User goes to idea page with login reminder set to true
      When I go to the Idea Detail page for the saved left choice with login reminder
      Then I should see "Log in to your account"
      And I should see "You must be logged in to perform this action"
      When I fill in "session_email" with "test@example.com"
      And I fill in "session_password" with "password"
      And I press "Log In"
      Then I should see "ADDED ON"
      And I should see "SCORE"
      And I should see "NUMBER OF VOTES"
      And I should see "Activated"
      
   @photocracy
   @selenium
   Scenario: Admin changes status
      When I sign in as "test@example.com/password"
      And I go to the Idea Detail page for the saved left choice
      Then I should see "ADDED ON"
      And I should see "SCORE"
      And I should see "NUMBER OF VOTES"
      And I should see "Activated"
      When I check "choice_active"
      Then I should see "Deactivated"
      When I go to the Idea Detail page for the saved left choice
      Then I should see "Deactivated"
