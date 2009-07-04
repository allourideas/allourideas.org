Given /^a Rails app with Cucumber$/ do
  system "rails rails_root"
  @rails_root = File.join(File.dirname(__FILE__), "..", "..", "rails_root")
  require 'cucumber'
end

Then /^a Cucumber "([^\"]*)" functional test for "([^\"]*)" should be generated$/ do |arg1, arg2|
  pending
end

Then /^a standard "posts" feature for the "new" scenario should be generated$/ do
  assert_generated_file("features/posts.feature") do |body|
    expected = "  Scenario: Create a new 'post'\n" <<
               "    Given I am on the new post page\n" <<
               "    When I create a 'post' named 'A new post'\n" <<
               "    Then I should see 'A new post'"
    assert body.include?(expected), 
      "expected #{expected} but was #{body.inspect}"
  end
end

