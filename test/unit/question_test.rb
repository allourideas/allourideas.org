require "test_helper"

class QuestionTest < ActiveSupport::TestCase
  should "pass along earl validation errors" do
    invalid_urls = [Earl.reserved_names.first, Earl.reserved_names.last, "test12-_,.", "with space", "", "bals@bla", "test/this", "askdf|", "=sdkjfs", "+"]
    invalid_urls.each do |url|
      q = Question.new(:name => "What question?", :ideas => "one\ntwo\nthree\nfour", :url => url)
      assert_equal false, q.valid?
    end
  end

  should "allow upper case" do
    q = Question.new(:name => "What question?", :ideas => "one\ntwo\nthree\nfour", :url => "UPIOWNR")
    assert q.valid?
  end

  should "make information attribute accessible" do
    q = Question.new(:information => "blah")
    assert_equal "blah", q.information
  end
end

#
# # in order to make this work, the test server has to be running:
#	# export Rails.env=test && ./script/server 4000
#
#  should "be valid with factories" do
#    q = Question.new(Factory.attributes_for(:question)) # we'll probably have to use this method for active resource objects
#    assert_valid q
#
#  end
#
#  should "validate urls correctly" do
#
#    invalid_urls = ['contains aspace', "", "bals@bla", "test/this", "askdf|", "=sdkjfs", '+']
#
#    invalid_urls.each do |url|
#    	q = Question.new(Factory.attributes_for(:question, :url => url))
#    	assert !q.valid?
#    end
#
#  end
#
#  should "validate names correctly" do
#      q = Question.new(Factory.attributes_for(:question, :name  => ""))
#      assert !q.valid?
#  end
#
#  should "not have a url of an existing question" do
#    e = Factory.create(:earl)
#
#    q = Question.new(Factory.attributes_for(:question, :url => e.name))
#    assert !q.valid?
#  end
#
#  context "question with view results of true" do
#    setup do
#      @q = Question.new(Factory.attributes_for(:question)) # we'll probably have to use this method for active resource objects
#      @q.show_results = true
#      @q.save
#
#      @e = Factory.create(:earl)
#      @e.question_id = @q.id
#      @e.save
#    end
#
#    should "allow non-user to view results" do
#      assert @q.user_can_view_results?(nil, @e)
#    end
#
#    should "allow non-creator user to view results" do
#      user = Factory.create(:email_confirmed_user)
#      assert @q.user_can_view_results?(user, @e)
#    end
#
#    should "allow creator to view results" do
#      assert @q.user_can_view_results?(@e.user, @e)
#    end
#
#    should "allow admin to view results" do
#      user = Factory.create(:email_confirmed_user)
#      user.admin = true
#      user.save
#      assert @q.user_can_view_results?(user, @e)
#    end
#
#  end
#
#  context "question with view results of false" do
#    setup do
#      @q = Question.new(Factory.attributes_for(:question)) # we'll probably have to use this method for active resource objects
#      @q.save
#      @q.show_results = false
#      @q.save
#
#      @e = Factory.create(:earl)
#      @e.question_id = @q.id
#      @e.save
#    end
#
#    should "not allow non-user to view results" do
#      assert_equal false, @q.user_can_view_results?(nil, @e)
#    end
#
#    should "not allow non-creator user to view results" do
#      user = Factory.create(:email_confirmed_user)
#      assert_equal false, @q.user_can_view_results?(user, @e)
#    end
#
#    should "allow creator to view results" do
#      assert @q.user_can_view_results?(@e.user, @e)
#    end
#
#    should "allow admin to view results" do
#      user = Factory.create(:email_confirmed_user)
#      user.admin = true
#      user.save
#      assert @q.user_can_view_results?(user, @e)
#    end
#
#  end
