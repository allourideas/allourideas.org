class SessionInfo < ActiveRecord::Base
	serialize :loc_info
	has_many :trials
	has_many :alternatives, :class_name => "Abingo::Alternative", :through => :trials #Tracking A/B tests
end
