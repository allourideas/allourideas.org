Feature: Toggling question idea auto activation
   In order to allow question administrators to moderate choices
   A question administrator
   Should be able to enable and disable idea autoactivation

   Background:
	Given an idea marketplace quickly exists with url 'test' and 4 ideas
        And I sign in as the admin for 'test'
        And I am on the Admin page for 'test'

	@javascript
	Scenario: User enables idea autoactivation
       When I check "earl_question_should_autoactivate_ideas"
       And I press "Save"
       Then the "earl_question_should_autoactivate_ideas" checkbox should be checked

	@javascript
	Scenario: User disables idea autoactivation
       When I check "earl_question_should_autoactivate_ideas"
       And I press "Save"
       Then the "earl_question_should_autoactivate_ideas" checkbox should be checked
       When I uncheck "earl_question_should_autoactivate_ideas"
       And I press "Save"
       Then the "earl_question_should_autoactivate_ideas" checkbox should not be checked
