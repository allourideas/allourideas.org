Given /^the following (.*) exists?:$/ do |factory, table|
  factory = factory.singularize.gsub(' ','_')
  table.hashes.each do |attributes|
    FactoryBot(factory, attributes)
  end
end

FactoryBot.factories.each do |name, factory|
  Given /^an? #{name} exists$/ do
    FactoryBot(name)
  end

  Given /^(\d+) #{name.to_s.humanize.downcase.pluralize} exist with an? ([^"]*) of "([^"]*)"$/ do |count, attr, value|
    count.to_i.times { FactoryBot(name, attr.gsub(' ', '_') => value) }
  end

  Given %r{^(\d+) #{name.to_s.humanize.downcase.pluralize} exist$} do |count|
    count.to_i.times { FactoryBot(name) }
  end
end

