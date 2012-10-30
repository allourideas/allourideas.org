Feature: Add idea to marketplace
  In order to have ideas from the community be considered 
  A user
  Should be able to add their own idea while voting
  
  Background: 
    Given an idea marketplace quickly exists with url 'test' and admin 'test@example.com/password'
    And I sign in as "test@example.com/password"
    And I am on the Cast Votes page for 'test'
    And no emails have been sent

    @javascript
    Scenario: Adding choice to unmoderated marketplace
      Given idea marketplace 'test' has enabled idea autoactivation
      When I upload an idea titled 'blah blah & blah'
      Then I should see "Your idea has been added" within ".idea-success"
      And the vote count should be 0
      And the idea count should be 3
      When I go to the View Results page for 'test'
      Then I should see "blah blah & blah"
      And "test@example.com" should receive an email 
      When "test@example.com" opens the email
      Then they should see "[All Our Ideas] idea added to question: test name" in the email subject
      And they should see "Someone has uploaded the idea 'blah blah & blah' to your question" in the email body
      And they should see "Based on your settings, we have auto-activated the idea" in the email body
      When they click the first link in the email
      Then I should see "You have successfully deactivated the idea 'blah blah & blah'"

     
    @javascript
    Scenario: Adding choice to unmoderated marketplace with new lines
      Given idea marketplace 'test' has enabled idea autoactivation
      When I upload an idea titled
        """
        blah foo blah
        """
      Then I should see "Your idea has been added" within ".idea-success"
      And the vote count should be 0
      And the idea count should be 3
      When I go to the View Results page for 'test'
      Then I should see "blah foo blah"
      And "test@example.com" should receive an email 
      When "test@example.com" opens the email
      Then they should see "[All Our Ideas] idea added to question: test name" in the email subject
      And they should see "Someone has uploaded the idea 'blah foo blah' to your question" in the email body
      And they should see "Based on your settings, we have auto-activated the idea" in the email body
      When they click the first link in the email
      Then I should see "You have successfully deactivated the idea 'blah foo blah'"


    @javascript
    Scenario: Adding choice to moderated marketplace
      When I upload an idea titled 'blah blah blah'
      Then I should see "Your idea has been submitted for review. It will appear soon." within ".idea-success"
      Then the vote count should be 0
      And the idea count should be 2
      When I go to the View Results page for 'test'
      Then I should not see "blah blah blah"
      When I sign in as the admin for 'test'
      And I go to the Admin Page for 'test'
      Then I should see "blah blah blah"
      And "test@example.com" should receive an email 
      When "test@example.com" opens the email
      Then they should see "[All Our Ideas] idea added to question: test name" in the email subject
      And they should see "Someone has uploaded the idea 'blah blah blah' to your question" in the email body
      And they should see "If you want others to be able to vote on this idea, please activate it by visiting the following url:" in the email body
      When they click the first link in the email
      Then I should see "You have successfully activated the idea 'blah blah blah'"

	
