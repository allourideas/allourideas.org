class Click < ActiveRecord::Base
	belongs_to :user
	belongs_to :session_info
end
