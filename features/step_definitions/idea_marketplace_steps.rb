Given /^an idea marketplace exists with url '(.*)'$/ do |url|
	Factory.create(:earl, :name => url)
end
