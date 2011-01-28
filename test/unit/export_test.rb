require 'test_helper'

class ExportTest < ActiveSupport::TestCase
  should "be valid with factory" do
    assert_valid Factory.build(:export)
  end
end
