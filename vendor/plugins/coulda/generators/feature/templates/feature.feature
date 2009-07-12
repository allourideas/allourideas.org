<% if %w(new create).any? { |action| actions.include?(action) } -%>
  Scenario: Create a new <%= resource %>
    Given I am on the new <%= resource %> page
    When I create a <%= resource %> named "A new <%= resource %>"
    Then I should see "A new <%= resource %>"
<% elsif %w(edit update).any? { |action| actions.include?(action) } -%>
  Scenario: Update a <%= resource %>
    Given I am on the edit "An existing <%= resource %>" <%= resource %> page
    When I update the <%= resource %>
    Then I should see "<%= resource_class %> updated"
<% end -%>
