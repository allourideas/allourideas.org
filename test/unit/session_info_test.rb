require 'test_helper'

class SessionInfoTest < ActiveSupport::TestCase
  should "be valid with factory" do
    assert_valid Factory.build(:session_info)
  end
end
