require 'test_helper'

class BlockedCookiesTest < ActiveSupport::TestCase
  should "be valid with factory" do
    assert_valid Factory.build(:blocked_cookies)
  end
end
