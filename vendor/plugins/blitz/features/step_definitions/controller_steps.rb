When /^I generate a "(.*)" controller with "(.*)" action$/ do |controller, action|
  system "cd #{@rails_root} && " <<
         "script/generate controller #{controller} #{action} && " <<
         "cd .."
end

Then /^a "(.*)" controller action for "posts" should be generated$/ do |action|
  assert_generated_file("app/controllers/posts_controller.rb") do
    "  actions :#{action}"
  end
end

Then /^only a "([^\"]*)" action for RESTful "([^\"]*)" route should be generated$/ do |action, resource|
  assert_generated_route_for resource, action
end

