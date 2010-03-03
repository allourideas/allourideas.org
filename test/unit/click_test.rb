require 'test_helper'

class ClickTest < ActiveSupport::TestCase
  should_belong_to :session_info
  should_belong_to :user
  
  should "be valid with factory" do
    assert_valid Factory.build(:click)
  end
end
