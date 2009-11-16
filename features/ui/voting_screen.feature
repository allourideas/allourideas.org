Feature: Voting Screen
  In order to get preferences from visitors
  A user
  Should be able to interact successfully with the voting screen

    Scenario: User has two choices and mouses over the left one
      Given I am on the question show page
      And the left prompt button is colored light gray
      When I move my mouse over the left prompt button
      Then I should see the left prompt button change color to dark gray
      
    Scenario: User has two choices, mouses over the left one, and mouses out
      Given I am on the question show page
      And my mouse is over the left prompt button
      And the left prompt button is colored dark gray
      When I move my mouse out from the left prompt button
      Then I should see the left prompt button change color back to light gray
        
    Scenario: User has two choices, mouses over the left one, and clicks on the button
      Given I am on the question show page
      And my mouse is over the left prompt button
      And the left prompt button is colored dark gray
      When I click on the left prompt button
      Then I should see the left prompt button change color to green
      And I should see the left prompt button change color back to light gray

    Scenario: User has two choices and mouses over the right one
      Given I am on the question show page
      And the right prompt button is colored light gray
      When I move my mouse over the right prompt button
      Then I should see the right prompt button change color to dark gray

    Scenario: User has two choices, mouses over the right one, and mouses out
      Given I am on the question show page
      And my mouse is over the right prompt button
      And the left prompt button is colored dark gray
      When I move my mouse out from the right prompt button
      Then I should see the prompt button change color back to light gray
      
    Scenario: User has two choices, mouses over the right one, and clicks on the button
      Given I am on the question show page
      And my mouse is over the right prompt button
      And the right prompt button is colored dark gray
      When I click on the right prompt button
      Then I should see the right prompt button change color to green
      And I should see the right prompt button change color back to light gray