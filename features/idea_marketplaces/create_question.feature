@focus
Feature: Creating Idea marketplaces
	In order to collect information on preferences
	As a question admin
	I want to be able to create an idea marketplace

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
	   |field       |value    |resulttext                     | landing_page|
	   |question_url|"bad url"  |Url contains spaces|the questions index page|
	   |question_url|"bad@url"  |Url contains special characters|the questions index page|
	   |question_url|"bad@url"  |Url contains special characters|the questions index page|
	   |question_url|"bad/url"  |Url contains special characters|the questions index page|
	   |question_url|"bad:url"  |Url contains special characters|the questions index page|
	   |question_url|"bad=url"  |Url contains special characters|the questions index page|
	   |question_url|"bad+url"  |Url contains special characters|the questions index page|
	   |question_url|"bad'url"  |Url contains special characters|the questions index page|
	   |question_url|"bad$url"  |Url contains special characters|the questions index page|
	   |question_url|" badurl"  |Url contains special characters|the questions index page|
	   |question_url|"badurl "  |Url contains special characters|the questions index page|
	   |question_url|"questions"|Url has already been taken|the questions index page|
	   |question_url|"admin"    |Url has already been taken|the questions index page|
	   |question_url|"admin"    |Url has already been taken|the questions index page|

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
			|question_url|Url is blank|
			|question_ideas|Ideas are blank|
			|question_email|Email can't be blank|
			|question_password|Password can't be blank|
	
	@selenium
	Scenario: User clicks Cant decide immediately after creating a question
		Given I am on the question create page
                When I fill in all fields with valid data except "question_url"
		And I fill in "question_url" with "test_cant_decide"
		And I press "Create"
		Then I should have the following query string:
		   |just_created|true|
		When I click the I can't decide button
		Then I should see "I like both ideas" within "#facebox"



