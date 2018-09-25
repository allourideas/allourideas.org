Feature: Paginate large view results set
   In order to better view large numbers of choices
   A user of a marketplace with lots of ideas
   Should be able to see pages of view results, rather than a large list

  Scenario: Lots of ideas
    Given an idea marketplace quickly exists with url 'test'
    And idea marketplace 'test' has 100 ideas
    When I go to the View Results page for 'test'
    Then I should see "Idea #002"
    And I should not see "Idea #050"
    When I follow "»"
    Then I should not see "Idea #002"
    And I should not see "Idea #009"
    And I should not see "Idea #010"
    And I should see "Idea #011"
    When I follow "View All"
    Then I should see "Idea #002"
    And I should see "Idea #100"

  Scenario: Some ideas
    Given an idea marketplace quickly exists with url 'test'
    And idea marketplace 'test' has 5 ideas
    When I go to the View Results page for 'test'
    Then I should see "Idea #001"
    And I should see "Idea #004"
    And I should not see "View All"
