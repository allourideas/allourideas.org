require File.dirname(__FILE__) + '/test_helper.rb'
include Rubaidh::GoogleAnalyticsViewHelper
include ActionView::Helpers::UrlHelper
include ActionView::Helpers::TagHelper

class ViewHelpersTest < Test::Unit::TestCase
  
  def setup
    Rubaidh::GoogleAnalytics.defer_load = false
  end
  
  def test_link_to_tracked_should_return_a_tracked_link
    assert_equal "<a href=\"http://www.example.com\" onclick=\"javascript:pageTracker._trackPageview('/sites/linked');\">Link</a>", link_to_tracked('Link', '/sites/linked', "http://www.example.com" )
  end
  
  def test_link_to_tracked_with_legacy_should_return_a_tracked_link
    Rubaidh::GoogleAnalytics.legacy_mode = true
    assert_equal "<a href=\"http://www.example.com\" onclick=\"javascript:urchinTracker('/sites/linked');\">Link</a>", link_to_tracked('Link', '/sites/linked', "http://www.example.com" )
  end
  
  def test_link_to_tracked_should_error_if_defer_load
    Rubaidh::GoogleAnalytics.defer_load = true
    assert_raise(Rubaidh::AnalyticsError) { link_to_tracked('Link', '/sites/linked', "http://www.example.com" ) }
  end
  
  def test_link_to_tracked_if_with_true_should_return_a_tracked_link
    assert_equal "<a href=\"http://www.example.com\" onclick=\"javascript:pageTracker._trackPageview('/sites/linked');\">Link</a>", link_to_tracked_if(true, 'Link', '/sites/linked', "http://www.example.com" )
  end
  
  def test_link_to_tracked_if_with_false_should_return_unlinked_text
    assert_equal "Link", link_to_tracked_if(false, 'Link', '/sites/linked', "http://www.example.com" )
  end
  
  def test_link_to_tracked_if_should_error_if_defer_load
    Rubaidh::GoogleAnalytics.defer_load = true
    assert_raise(Rubaidh::AnalyticsError) { link_to_tracked_if(false, 'Link', '/sites/linked', "http://www.example.com" ) }
  end
  
  def test_link_to_tracked_unless_with_false_should_return_a_tracked_link
    assert_equal "<a href=\"http://www.example.com\" onclick=\"javascript:pageTracker._trackPageview('/sites/linked');\">Link</a>", link_to_tracked_unless(false, 'Link', '/sites/linked', "http://www.example.com" )
  end
  
  def test_link_to_tracked_unless_with_true_should_return_unlinked_text
    assert_equal "Link", link_to_tracked_unless(true, 'Link', '/sites/linked', "http://www.example.com" )
  end
  
  def test_link_to_tracked_unless_should_error_if_defer_load
    Rubaidh::GoogleAnalytics.defer_load = true
    assert_raise(Rubaidh::AnalyticsError) { link_to_tracked_unless(false, 'Link', '/sites/linked', "http://www.example.com" ) }
  end

  def test_link_to_tracked_unless_current
    #postponed
  end
  
end
