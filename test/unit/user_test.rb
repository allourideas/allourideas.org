require 'test_helper'

class UserTest < ActiveSupport::TestCase
  should_have_many :earls
  should_have_many :session_infos
  should_have_many :clicks


  should "be valid with factories" do
    assert_valid Factory.build(:user)
    assert_valid Factory.create(:user)
    assert_valid Factory.create(:email_confirmed_user)
    assert_valid Factory.build(:email_confirmed_user)
  end

  should "have email automagically activated" do
	  user = Factory.create(:user)
	  assert user.email_confirmed
  end

  should "support redaction" do
    user = Factory.create(:user)
    old_pass = user.encrypted_password
    user.redact!
    assert user.email.end_with?(".redacted@host.allourideas")
    assert_not_equal old_pass, user.encrypted_password
  end

  should "determine ownership of Earls correctly" do
	  owner = Factory.create(:user)
	  non_owner = Factory.create(:user)

	  earl = Factory.create(:earl, :user => owner)
	  assert owner.owns?(earl)
	  assert !non_owner.owns?(earl)

  end

  #remote_user and set_remote_session can probably be refactored. Want to wait till more integration tests are defined before doing so
  #



end

