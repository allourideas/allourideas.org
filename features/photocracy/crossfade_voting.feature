Feature: Voting

 Background:
    Given a photocracy idea marketplace quickly exists with url 'test'
    And I am on the Crossfade Cast Votes page for 'test'

 @photocracy
 @selenium
 Scenario: User votes on a photo, should see winner and loser
    When I click on the left photo
    Then there should be only two "Click To Vote" elements
