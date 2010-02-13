require 'test_helper'

class ClickTest < ActiveSupport::TestCase
  should "be valid with factory" do
    assert_valid Factory.build(:click)
  end
end
