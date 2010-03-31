require 'test_helper'

class DensityTest < ActiveSupport::TestCase
  should "be valid with factory" do
    assert_valid Factory.build(:density)
  end
end
