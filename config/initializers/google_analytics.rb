# Google Analytics is only available in production by default
# http://github.com/rubaidh/google_analytics

if ENV['GOOGLE_ANALYTICS_TRACKER_ID']
  Rubaidh::GoogleAnalytics.tracker_id = ENV['GOOGLE_ANALYTICS_TRACKER_ID']
end
