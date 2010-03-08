require 'test_helper'

class VisitorTest < ActiveSupport::TestCase
  should "be valid with factory" do
    assert_valid Factory.build(:visitor)
  end

  should_have_many :session_infos
end
