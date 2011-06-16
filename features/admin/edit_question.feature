Feature: Editing a question's text
   In order to allow question administrators to fix a question
   A question administrator
   Should be able to edit the question

  Background:
    Given an idea marketplace quickly exists with url 'test' and 4 ideas
    And I sign in as the admin for 'test'
    And I am on the Admin page for 'test'

  @selenium
  Scenario: Admin can edit the question
    Then I should see "[edit]" within ".row0 .header:first a"
    When I click on the edit link for the question
    Then I should see "Edit Question" within "#facebox .add-box h2"
    When I fill in "question[name]" with "some new text" within "#facebox .add-box"
    And I click "#edit_question_submit"
    Then I should see "some new text" within ".question-name"
    And I should see "Your question has been saved." within "#facebox .add-box p"
