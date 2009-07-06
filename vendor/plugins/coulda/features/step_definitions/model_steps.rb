# GENERATION

When /^I generate a model named "(.*)"$/ do |model|
  system "cd #{@rails_root} && " <<
         "script/generate model #{model} && " <<
         "cd .."
end

When /^I generate a model "(.*)" with a (.*) "(.*)"$/ do |model, attr_type, attr_name|
  system "cd #{@rails_root} && " <<
         "script/generate model #{model} #{attr_name}:#{attr_type} && " <<
         "cd .."
end

When /^I generate a model "(.*)" that belongs to a "(.*)"$/ do |model, association|
  association.downcase!
  system "cd #{@rails_root} && " <<
         "script/generate model #{model} #{association}:belongs_to && " <<
         "cd .."
end

When /^I generate a model "(.*)" with file "(.*)"$/ do |model, file|
  file.downcase!
  system "cd #{@rails_root} && " <<
         "script/generate model #{model} #{file}:paperclip && " <<
         "cd .."
end

# MODEL

Then /^the "(.*)" model should have "(.*)" macro$/ do |model, macro|
  model.downcase!
  assert_generated_file("app/models/#{model}.rb") do
    macro
  end
end

# FACTORY

Then /^a factory should be generated for "(.*)"$/ do |model|
  model.downcase!
  assert_generated_file("test/factories/#{model}.rb") do
    "Factory.define :#{model.downcase} do |#{model.downcase}|\n" <<
    "end\n"
  end
end

Then /^a factory for "(.*)" should have an? "(.*)" (.*)$/ do |model, attr_name, attr_type|
  model.downcase!
  assert_generated_file("test/factories/#{model}.rb") do
    "Factory.define :#{model} do |#{model}|\n"     <<
    "  #{model}.#{attr_name} { '#{attr_type}' }\n" <<
    "end\n"
  end
end

Then /^a factory for "(.*)" should have an association to "(.*)"$/ do |model, associated_model|
  model.downcase!
  associated_model.downcase!
  assert_generated_file("test/factories/#{model}.rb") do
    "Factory.define :#{model} do |#{model}|\n"       <<
    "  #{model}.association(:#{associated_model})\n" <<
    "end\n"
  end
end

# UNIT TEST

Then /^a unit test should be generated for "(.*)"$/ do |model|
  model.downcase!
  assert_generated_file("test/unit/#{model}_test.rb") do
    "assert_valid Factory.build(:#{model})"
  end
end

Then /^the "(.*)" unit test should have "(.*)" macro$/ do |model, macro|
  model.downcase!
  assert_generated_file("test/unit/#{model}_test.rb") do
    macro
  end
end

# MIGRATION

Then /^the "(.*)" table should have db index on "(.*)"$/ do |table, foreign_key|
  assert_generated_migration(table) do
    "add_index :#{table}, :#{foreign_key}"
  end
end

Then /^the "(.*)" table should have paperclip columns for "(.*)"$/ do |table, attr|
  assert_generated_migration(table) do
    "      table.string :#{attr}_file_name\n"    <<
    "      table.string :#{attr}_content_type\n" <<
    "      table.integer :#{attr}_file_size\n"   <<
    "      table.datetime :#{attr}_updated_at"
  end
end


