class Click < ActiveRecord::Base
	belongs_to :user
	belongs_to :session_info

  before_create :translate_tracking_to_info

  # checks referrer to see if this click was done on a widget
  def widget?
    return false if referrer.blank?
    begin
      uri = URI.parse(referrer)
      referrer.include?('widget') || (!uri.host.nil? && uri.host.include?('iphone'))
    rescue
      return referrer.include?('widget')
    end
  end

  private
    def translate_tracking_to_info
      {:url => url, :referrer => referrer}.each do |k, value|
        if value && value.match(/[?&]tracking=/)
          begin
            querystring = CGI.parse(URI.parse(value).query)
            unless querystring.has_key?('info')
              self[k] = value.gsub(/([?&])tracking=/, '\1info=')
            end
          rescue
            nil
          end
        end
      end
    end

end
