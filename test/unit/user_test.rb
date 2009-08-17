require 'test_helper'

class UserTest < ActiveSupport::TestCase
  should "be valid with factories" do
    assert_valid Factory.build(:user)
    assert_valid Factory.build(:email_confirmed_user)
  end
end

