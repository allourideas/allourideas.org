@focus
Feature: Creating Idea marketplaces
	In order to collect information on preferences
	As a question admin
	I want to be able to create an idea marketplace

	Scenario Outline: user submit question registration info
		Given I am on the question create page
		When I fill in "question_name" with "<name>"
		And I fill in "question_url" with "<url>"
		And I fill in "question_question_ideas" with "<ideas>"
		And I fill in "question_email" with "<email>"
		And I fill in "question_password" with "<password>"
		And I press "Create"
		Then I should see "<resulttext>" 
		
        Scenarios: valid registration info
	   |name   |url    |ideas|email               |password  |resulttext                                                 |
	   |test123|testing|1    |testing@dkapadia.com|helloworld|Congratulations. You are about to discover some great ideas.|
	   |test456|testing456|1\n2\n3\n    |test@dkapadia.com|helloworld|Congratulations. You are about to discover some great ideas.|
	   |test_45-6|testing_45-6|1\n2\n3\n    |test@dkapadia.com|helloworld|Congratulations. You are about to discover some great ideas.|
	
         Scenarios: invalid registration info
	   |name   |url    |ideas|email               |password  |resulttext                                                 |
	   |Blank spaces|bad url|1\n2\n3\n    |test@dkapadia.com|helloworld|Url contains spaces|
	   |Bad Symbol|bad@url|1\n2\n3\n    |test@dkapadia.com|helloworld|Url contains special characters|
	   |Bad Symbol|bad@url|1\n2\n3\n    |test@dkapadia.com|helloworld|Url contains special characters|
	   |Bad Symbol|bad/url|1\n2\n3\n    |test@dkapadia.com|helloworld|Url contains special characters|
	   |Bad Symbol|bad:url|1\n2\n3\n    |test@dkapadia.com|helloworld|Url contains special characters|
	   |Bad Symbol|bad=url|1\n2\n3\n    |test@dkapadia.com|helloworld|Url contains special characters|
	   |Bad Symbol|bad+url|1\n2\n3\n    |test@dkapadia.com|helloworld|Url contains special characters|
	   |Bad Symbol|bad'url|1\n2\n3\n    |test@dkapadia.com|helloworld|Url contains special characters|
	   |Bad Symbol|bad$url|1\n2\n3\n    |test@dkapadia.com|helloworld|Url contains special characters|
	   |Reserved url|questions|1\n2\n3\n    |test@dkapadia.com|helloworld|errors prohibited this website|
	   |Reserved url|admin|1\n2\n3\n    |test@dkapadia.com|helloworld|errors prohibited this website|
	   |Reserved url|admin|1\n2\n3\n    |test@dkapadia.com|helloworld|errors prohibited this website|
	   #|\"\"|blankname|1\n2\n3\n    |test@dkapadia.com|helloworld|errors prohibited this website|
	   #|Blank Ideas|blankname|\"\"|test@dkapadia.com|helloworld|errors prohibited this website|
	   #|Blank user|blankuser|1\n2\n3\n|\"\"|helloworld|errors prohibited this website|
	   #|Blank Password|blankpasswd|1\n2\n3\n    |test@dkapadia.com|\"\"|errors prohibited this website|
	   #|Bad Symbol|bad\"url|1\n2\n3\n    |test@dkapadia.com|helloworld|Url contains special characters|

	Scenario: User submits an existing url
		Given an idea marketplace exists with url 'taken'
		And I am on the question create page
		When I fill in the following:
		  |question_name|TakenUrl?|
		  |question_url|taken|
		  |question_question_ideas|1|
		  |question_email|blah@blah.com|
		  |question_password|password|
		And I press "Create"
		Then I should see "errors prohibited this website"
		And I should not see "Congratulations."


