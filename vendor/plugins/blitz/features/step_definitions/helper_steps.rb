When /^I generate a helper named "(.*)"$/ do |name|
  system "cd #{@rails_root} && " <<
         "script/generate helper #{name} && " <<
         "cd .."
end

Then /^a helper should be generated for "(.*)"$/ do |name|
  assert_generated_file("app/helpers/#{name}_helper.rb")
end

Then /^a helper test should be generated for "(.*)"$/ do |name|
  assert_generated_file("test/unit/helpers/#{name}_helper_test.rb")
end

