Feature: Control Flag as Inappropriate
	In order to prevent unsavory materials from appearing on our site
	As a question administrator
	I should be able to allow or prevent Users from flagging choices as inappropriate

	Background: 
          Given an idea marketplace exists with admin 'test@dkapadia.com' and password 'blah' and url 'test'
          And I sign in as "test@dkapadia.com/blah"
          And I am on the Admin page for 'test'

	Scenario: Flag defaults to off
	  When I go to the Cast Votes page for 'test'
	  Then I should not see "Flag as inappropriate"
	
	Scenario: I enable flag as inappropriate
	  When I select "Enabled" from "earl_flag_enabled"
	  And I press "Save"
	  And I go to the Cast Votes page for 'test'
	  Then I should see "Flag as inappropriate"

	Scenario: I disable flag as inappropriate after enabling
	  Given idea marketplace 'test' has enabled "flag as inappropriate"
	  When I select "Disabled" from "earl_flag_enabled"
	  And I press "Save"
	  And I go to the Cast Votes page for 'test'
	  Then I should not see "Flag as inappropriate"
