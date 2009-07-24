require 'rubaidh/google_analytics'
require 'rubaidh/view_helpers'
ActionController::Base.send :include, Rubaidh::GoogleAnalyticsMixin
ActionController::Base.send :after_filter, :add_google_analytics_code
ActionView::Base.send :include, Rubaidh::GoogleAnalyticsViewHelper