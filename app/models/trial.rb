class Trial < ActiveRecord::Base
	belongs_to :session_info
	belongs_to :alternative
end
