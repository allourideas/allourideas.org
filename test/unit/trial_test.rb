require 'test_helper'

class TrialTest < ActiveSupport::TestCase
  should_belong_to :session_info
  should_belong_to :alternative

  should "be valid with factory" do
    assert_valid Factory.build(:trial)
  end
end
