module Rubaidh
  # Collection of methods similar to the ones in ActionView::Helpers::UrlHelper,
  # with the addition of outbound link tracking. See the Google Analytics help
  # at http://www.google.com/support/googleanalytics/bin/answer.py?answer=55527
  # for more information on outbound link tracking.
  module GoogleAnalyticsViewHelper
    # Creates a link tag of the given +name+ using a URL created by the set of +options+,
    # with outbound link tracking under +track_path+ in Google Analytics. The +html_options+
    # will accept a hash of attributes for the link tag.
    def link_to_tracked(name, track_path = "/", options = {}, html_options = {})
      raise AnalyticsError.new("You must set Rubaidh::GoogleAnalytics.defer_load = false to use outbound link tracking") if GoogleAnalytics.defer_load == true
      html_options.merge!({:onclick => tracking_call(track_path)})
      link_to name, options, html_options
    end
    
    # Creates a link tag of the given +name+ using a URL created by the set of +options+
    # if +condition+ is true, with outbound link tracking under +track_path+ in Google Analytics. 
    # The +html_options+ will accept a hash of attributes for the link tag.
    def link_to_tracked_if(condition, name, track_path = "/", options = {}, html_options = {}, &block)
      raise AnalyticsError.new("You must set Rubaidh::GoogleAnalytics.defer_load = false to use outbound link tracking") if GoogleAnalytics.defer_load == true
      html_options.merge!({:onclick => tracking_call(track_path)})
      link_to_unless !condition, name, options, html_options, &block
    end
    
    # Creates a link tag of the given +name+ using a URL created by the set of +options+
    # unless +condition+ is true, with outbound link tracking under +track_path+ in Google Analytics. 
    # The +html_options+ will accept a hash of attributes for the link tag.
    def link_to_tracked_unless(condition, name, track_path = "/", options = {}, html_options = {}, &block)
      raise AnalyticsError.new("You must set Rubaidh::GoogleAnalytics.defer_load = false to use outbound link tracking") if GoogleAnalytics.defer_load == true
      html_options.merge!({:onclick => tracking_call(track_path)})
      link_to_unless condition, name, options, html_options, &block
    end
    
    # Creates a link tag of the given +name+ using a URL created by the set of +options+
    # unless the current request URI is the same as the link's, with outbound link tracking 
    # under +track_path+ in Google Analytics. If the request URI is the same as the link 
    # URI, only the name is returned, or the block is yielded, if one exists.
    # The +html_options+ will accept a hash of attributes for the link tag.
    def link_to_tracked_unless_current(name, track_path = "/", options = {}, html_options = {}, &block)
      raise AnalyticsError.new("You must set Rubaidh::GoogleAnalytics.defer_load = false to use outbound link tracking") if GoogleAnalytics.defer_load == true
      html_options.merge!({:onclick =>tracking_call(track_path)})
      link_to_unless current_page?(options), name, options, html_options, &block
    end
    
private

    def tracking_call(track_path)
      if GoogleAnalytics.legacy_mode
        "javascript:urchinTracker('#{track_path}');"
      else
        "javascript:pageTracker._trackPageview('#{track_path}');"
      end
    end
    
  end
  
  # Error raised by tracking methods if Rubaidh::GoogleAnalytics.defer_load is not configured
  # properly to enable tracking.
  class AnalyticsError < StandardError
    attr_reader :message
    
    def initialize(message)
      @message = message
    end
  end
end

