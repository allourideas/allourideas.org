class BlockedCookie < ActiveRecord::Base
  named_scope :today, :conditions => ["created_at >= ?", Time.now.beginning_of_day]
end
