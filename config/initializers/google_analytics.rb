# Google Analytics is only available in production by default
# http://github.com/rubaidh/google_analytics

if (RAILS_ENV == 'production') || (RAILS_ENV == 'staging') #ENV['GOOGLE_ANALYTICS_TRACKER_ID']
  Rubaidh::GoogleAnalytics.tracker_id = 'UA-11703548-1' #ENV['GOOGLE_ANALYTICS_TRACKER_ID']
end
