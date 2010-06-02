Feature: Paginate large view results set
   In order to better view large numbers of choices
   A user of a marketplace with lots of ideas
   Should be able to see pages of view results, rather than a large list

	Scenario: Lots of ideas
		Given an idea marketplace exists with url 'test'
		And idea marketplace 'test' has 100 ideas
		When I go to the View Results page for 'test'
		Then I should see "Idea #2"
		And I should not see "Idea #50"
		When I follow "See more..."
		Then I should see "Idea #2"
		And I should see "Idea #50"
		And I should not see "Idea #51"
		When I follow "Next >>"
		Then I should not see "Idea #2"
		And I should not see "Idea #49"
		And I should see "Idea #51"
		When I follow "See All 102 Ideas"
		Then I should see "Idea #2"
		And I should see "Idea #100"
 

	Scenario: Some ideas
		Given an idea marketplace exists with url 'test'
		And idea marketplace 'test' has 5 ideas
		When I go to the View Results page for 'test'
		Then I should see "Idea #1"
		And I should see "Idea #4"
		And I should not see "See More..."
	
	Scenario: One page of ideas
		Given an idea marketplace exists with url 'test'
		And idea marketplace 'test' has 35 ideas
		When I go to the View Results page for 'test'
		Then I should see "Idea #1"
		And I should see "Idea #4"
		And I should not see "Idea #35"
		When I follow "See more..."
		Then I should see "Idea #1"
		And I should see "Idea #4"
		And I should see "Idea #30"
		And I should not see "See All"
