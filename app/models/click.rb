class Click < ActiveRecord::Base
	belongs_to :user
	belongs_to :session_info

  # checks referrer to see if this click was done on a widget
  def widget?
    return false if referrer.blank?
    uri = URI.parse(referrer)
    referrer.include?('widget') || (!uri.host.nil? && uri.host.include?('iphone'))
  end
end
