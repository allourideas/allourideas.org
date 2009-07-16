Given /^the following (.*) exists?:$/ do |factory, table|
  factory = factory.singularize.gsub(' ','_')
  table.hashes.each do |attributes|
    Factory(factory, attributes)
  end
end

Factory.factories.each do |name, factory|
  if factory.build_class.respond_to?(:columns)
    factory.build_class.columns.each do |column|
      Given %{^an? #{name.to_s.humanize.downcase} exists with an? #{column.name.humanize.downcase} of "([^"]*)"$} do |value|
        Factory(name, column.name => value)
      end

      Given %{^an? #{name.to_s.humanize.downcase} exists with an? #{column.name.humanize.downcase} of "([^"]*)" and a "([^"]*)" of "([^"]*)"$} do |first_value, second_column, second_value|
        Factory(name, column.name => value, second_column.downcase.to_sym => second_value)
      end
    end
  end

  Given /^an? #{name} exists$/ do
    Factory(name)
  end

  Given /^(\d+) #{name.to_s.humanize.downcase.pluralize} exist with an? ([^"]*) of "([^"]*)"$/ do |count, attr, value|
    count.to_i.times { Factory(name, attr.gsub(' ', '_') => value) }
  end

  Given %r{^(\d+) #{name.to_s.humanize.downcase.pluralize} exist$} do |count|
    count.to_i.times { Factory(name) }
  end
end

