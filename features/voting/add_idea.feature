Feature: Add idea to marketplace
  In order to have ideas from the community be considered 
  A user
  Should be able to add their own idea while voting
  
  Background: 
    Given an idea marketplace exists with url 'test'
    And I am on the Cast Votes page for 'test'

    @selenium
    Scenario: Adding choice to unmoderated marketplace
      Given idea marketplace 'test' has enabled idea autoactivation
      When I upload an idea titled 'blah blah blah'
      Then I should see "You just added an idea for people to vote on: blah blah blah" within ".tellmearea"
      Then I should see "Now you have cast 0 votes and added 1 idea" within ".tellmearea"
      And the vote count should be 0
      And the idea count should be 3

    @selenium
    Scenario: Adding choice to moderated marketplace
      When I upload an idea titled 'blah blah blah'
      Then I should see "Thank you. Your idea has been submitted for review, and it will appear soon" within "#facebox"
      Then I should see "Cast Votes" within "#facebox"
      When I close the facebox
      Then I should see "Now you have cast 0 votes and added 1 idea" within ".tellmearea"
      Then the vote count should be 0
      And the idea count should be 2
	
