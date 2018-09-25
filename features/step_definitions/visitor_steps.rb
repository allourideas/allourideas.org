Given /^there are no User Sessions$/ do
  SessionInfo.delete_all
end

Then /^there should be (\d*) User Sessions?$/ do |num|
  SessionInfo.count.should == num.to_i
end

Given /^there are no Visitors$/ do
  Visitor.delete_all
end

Then /^there should be (\d*) Visitor$/ do |num|
  Visitor.count.should == num.to_i
end


When /^(\d*) minutes? pass$/ do |mins|
  time = mins.to_i.minutes
  Timecop.travel time
end

