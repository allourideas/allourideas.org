<% if %w(new create).any? { |action| actions.include?(action) } -%>
  Scenario: Create a new <%= resource %>
    Given I am on the new <%= resource %> page
    When I create a <%= resource %> named "A new <%= resource %>"
    Then I should see "A new <%= resource %>"
<% end -%>
