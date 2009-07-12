Given /^a Rails app with Cucumber$/ do
  system "rails rails_root"
  @rails_root = File.join(File.dirname(__FILE__), "..", "..", "rails_root")
  require 'cucumber'
  system "cd #{@rails_root} && ruby script/generate cucumber"
end

When /^I generate a "([^\"]*)" feature for "([^\"]*)"$/ do |feature, resource|
  system "cd #{@rails_root} && " <<
         "script/generate feature #{resource} #{feature} && " <<
         "cd .."
end

Then /^a "posts" feature for the "([^\"]*)" scenario should be generated$/ do |action|
  if %w(new create).include?(action)
    assert_generated_file("features/posts.feature") do
      "  Scenario: Create a new post\n"                 <<
      "    Given I am on the new post page\n"           <<
      "    When I create a post named \"A new post\"\n" <<
      "    Then I should see \"A new post\""
    end
  elsif %w(edit update).include?(action)
    assert_generated_file("features/posts.feature") do
      "  Scenario: Update a post\n"                                 <<
      "    Given I am on the edit \"An existing post\" post page\n" <<
      "    When I update the post\n"                                <<
      "    Then I should see \"Post updated\""
    end
  end
end

Then /^a "create posts" step definition should be generated$/ do
  assert_generated_file("features/step_definitions/posts_steps.rb") do
    "When /^I create a post named \"([^\\\"]*)\"$/ do |name|\n" <<
    "  fills_in :name, :with => name\n"                         <<
    "  click_button 'Create'\n"
    "end"
  end
end

Then /^a new post page path should be generated$/ do
  assert_generated_file("features/support/paths.rb") do
    "    when /the new post page/i\n" <<
    "      new_post_path"
  end
end

Then /^a "update posts" step definition should be generated$/ do
  assert_generated_file("features/step_definitions/posts_steps.rb") do
    "When /^I update a post named \"([^\\\"]*)\"$/ do |name|\n" <<
    "  fills_in :name, :with => name\n"                         <<
    "  click_button 'Update'\n"
    "end"
  end
end

Then /^a edit post page path should be generated$/ do
  assert_generated_file("features/support/paths.rb") do
    "    when /the edit \"([^\\\"]*)\" post page/i do |name|\n" <<
    "      post = Post.find_by_name(name)\n"
    "      edit_post_path(post)"
  end
end

