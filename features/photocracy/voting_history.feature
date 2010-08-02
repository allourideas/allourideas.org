Feature: Voting history
 In order to encourage more votes
 A user
 Should be able to see their history of votes

 Background:
    Given a photocracy idea marketplace quickly exists with url 'test'
    And I am on the Cast Votes page for 'test'
    And I save the current two photos

 Scenario: User votes on a photo, should see winner and loser
    When I click on the left photo
    Then I should see thumbnails of the two saved choices in the voting history area
    And the left thumbnail should be a winner
    And the right thumbnail should be a loser

 Scenario: User skips a prompt
    When I click the I can't decide button
    And I pick "I like both ideas"
    And I click the I can't decide submit button
    Then I should see thumbnails of the two saved choices in the voting history area
    And the left thumbnail should be a loser
    And the right thumbnail should be a loser
    
@focus
@photocracy
@selenium
 Scenario: User flags a photo as inappropriate
    Given idea marketplace 'test' has enabled "flag as inappropriate"
    And I am on the Cast Votes page for 'test'
    When I click the flag link for the left choice
    And I fill in "inappropriate_reason" with "Because it's offensive"
    And I click the photocracy flag submit button
    Then I should not see thumbnails of the two saved choices in the voting history area
    Given I save the current two photos
    When I click on the left photo
    Then I should see thumbnails of the two saved choices in the voting history area
    And the left thumbnail should be a winner
    And the right thumbnail should be a loser
