require 'test_helper'

class EarlTest < ActiveSupport::TestCase

  should_belong_to :user
  should_have_attached_file :logo

  should "be valid with factories" do
    assert_valid Factory.build(:earl)
    assert_valid Factory.create(:earl)
  end

  should "not allow reserved words to be saved" do 
	  assert_raises(FriendlyId::SlugGenerationError) { Factory.create(:earl, :name => "privacy")}
  end

  should "show nil ideas as not spammy" do
    e = Earl.new
    assert !e.ideas_look_spammy?
  end

  should "show check for spammy ideas" do
    map = {
      nil => false,
      "some idea\nanother idea" => false,
      "http://some idea\nanother idea" => true,
      "https://some idea\nanother idea" => true,
    }
    map.each do |ideas, expected|
      e = Earl.new(:ideas => ideas)
      assert_equal expected, e.ideas_look_spammy?
    end
  end

  should "update the proper fields when requiring verification" do
    e = Earl.new
    e.require_verification!
    assert_equal false, e.active
    assert_equal 16, e.verify_code.length
  end

  should "verify code and enable earl" do
    e = Factory.create(:earl)
    e.require_verification!

    assert_equal false, e.verify!(nil)
    assert_equal false, e.verify!('baoinfoaisnf')
    assert_equal true, e.verify!(e.verify_code)
    assert_equal true, e.active
    assert_equal nil, e.verify_code
    # Already active, so verify should return true.
    assert_equal true, e.verify!(nil)
  end

  should "verify code even if survey is considered active" do
    e = Factory.create(:earl)
    e.require_verification!
    e.active = true
    e.save
    assert_equal true, e.verify!(e.verify_code)
    assert_equal nil, e.verify_code
    assert_equal false, e.requires_verification?
  end

  should "know if it needs verification" do
    e = Factory.create(:earl)
    assert_equal false, e.requires_verification?
    e.require_verification!
    assert_equal true, e.requires_verification?
  end

end

