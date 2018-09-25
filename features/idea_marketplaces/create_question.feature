Feature: Creating Idea marketplaces
  In order to collect information on preferences
  As a question admin
  I want to be able to create an idea marketplace

  Scenario Outline: invalid submission should retain information field
    Given I am on the question create page
    When I fill in all fields with valid data except "question_url"
    And I fill in "question_information" with "ruAbudtav8"
    And I press "Create"
    Then I should see "ruAbudtav8"
    And I should be on the questions index page

  Scenario Outline: user submits question registration info
    Given I am on the question create page
    When I fill in all fields with valid data except "<field>"
    And I fill in "<field>" with <value>
    And I press "Create"
    Then I should see "<resulttext>"
    And I should be on <landing_page>

  Scenarios: valid registration info
     |field    |value          |resulttext                                                  | landing_page|
     |question_url|"testing"     |Congratulations. You are about to discover some great ideas.| the Cast Votes page for 'testing'|
     |question_url|"testing456"  |Congratulations. You are about to discover some great ideas.| the Cast Votes page for 'testing456'|
     |question_url|"testing_45-6"   |Congratulations. You are about to discover some great ideas.| the Cast Votes page for 'testing_45-6'|

  Scenarios: invalid registration info
     |field       |value      |resulttext     | landing_page           |
     |question_url|"bad url"  |Url allows only|the questions index page|
     |question_url|"bad@url"  |Url allows only|the questions index page|
     |question_url|"bad@url"  |Url allows only|the questions index page|
     |question_url|"bad/url"  |Url allows only|the questions index page|
     |question_url|"bad:url"  |Url allows only|the questions index page|
     |question_url|"bad=url"  |Url allows only|the questions index page|
     |question_url|"bad+url"  |Url allows only|the questions index page|
     |question_url|"bad'url"  |Url allows only|the questions index page|
     |question_url|"bad$url"  |Url allows only|the questions index page|
     |question_url|" badurl"  |Url allows only|the questions index page|
     |question_url|"badurl "  |Url allows only|the questions index page|
     |question_url|"questions"|is reserved|the questions index page|
     |question_url|"admin"    |is reserved|the questions index page|
     |question_url|"admin"    |is reserved|the questions index page|

  Scenario: User submits an existing url
    Given an idea marketplace exists with url 'taken'
    And I am on the question create page
    When I fill in the following:
      |question_name|TakenUrl?|
      |question_url|taken|
      |question_ideas|1|
      |question_email|blah@blah.com|
      |question_password|password|
    And I press "Create"
    Then I should see "errors prohibited this website"
    And I should not see "Congratulations."

  Scenario Outline: User does not fill in all fields
    Given I am on the question create page
    When I fill in all fields with valid data except "<field>"
    And I press "Create"
    Then I should not see "Congratulations"
    And I should see "<result_text>"

    Scenarios: missing fields
      |field|result_text|
      |question_name|Name is blank|
      |question_url|Url can't be blank|
      |question_ideas|Ideas are blank|
      |question_email|Email can't be blank|
      |question_password|Password can't be blank|

  @javascript
  Scenario: User clicks Cant decide immediately after creating a question
    Given I am on the question create page
                When I fill in all fields with valid data except "question_url"
    And I fill in "question_url" with "test_cant_decide"
    And I press "Create"
    Then I should have the following query string:
       |just_created|true|
    When I click the I can't decide button
    Then I should see "I like both ideas"

  Scenario: User should receive email after question is created
    Given I am on the question create page
    And no emails have been sent
                When I fill in all fields with valid data except "question_email"
    And I fill in "question_email" with "testemail@example.com"
    And I fill in "question_url" with "test12345"
    And I press "Create"
    And I wait for background jobs to complete
    Then "signups@example.org" should receive an email
    And "testemail@example.com" should receive an email
    When "testemail@example.com" opens the email
    Then they should see "Account confirmation" in the email subject
    And they should see "This email confirms your recent activity on" in the email body
    And they should see "/test12345" in the email body

  Scenario: Admins should receive optional question emails
    Given I am on the question create page
    And no emails have been sent
                When I fill in all fields with valid data except "question_name"
    And I fill in "question_name" with "Which of these is the best dancer?"
    And I fill in "question_information" with "I want to save the world"
    And I press "Create"
    And I wait for background jobs to complete
    Then "signups@example.org" should receive 2 emails
    When "signups@example.org" opens the email with subject "Extra Information included in Which of these is the best dancer?"
    Then they should see "I want to save the world" in the email body
