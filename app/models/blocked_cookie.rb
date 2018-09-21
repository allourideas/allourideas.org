class BlockedCookie < ActiveRecord::Base
  scope :today, -> { where("created_at >= ?", Time.now.beginning_of_day) }
end
