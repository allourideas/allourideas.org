require 'test_helper'

class TrialTest < ActiveSupport::TestCase
  should "be valid with factory" do
    assert_valid Factory.build(:trial)
  end
end
