# Google Analytics is only available in production by default
# http://github.com/rubaidh/google_analytics

Rubaidh::GoogleAnalytics.environments = ['production', 'staging']
Rubaidh::GoogleAnalytics.tracker_id = ENV['GOOGLE_ANALYTICS_TRACKER_ID'] || "UA-11703548-1"
