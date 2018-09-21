Feature: Export data to CSV files
  In order to ensure data portability and ease of research
  A question administrator
  Should be able to export question data to a CSV file

  Background:
     Given an idea marketplace exists with admin 'test@dkapadia.com' and password 'blah' and url 'test'
     And I am on the Admin page for 'test'
     And I sign in as "test@dkapadia.com/blah"

  Scenario: Request data export
    Given there are no Delayed Jobs
    When I click on the request button for the Votes CSV file
    Then I should see "You have requested a data export"
    And a background job should have been created
    And the the background job should call 'ExportJob'
    #When all delayed jobs have finished
    #Then an email should be sent to 'test@dkapdaia.com"
    #And 


