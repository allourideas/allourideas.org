class <%= class_name %>Controller < InheritedResources::Base
<% if actions.any? -%>
  actions <%= actions.collect { |action| ":#{action}" }.join(", ") %>
<% end -%>
end
