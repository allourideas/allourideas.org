require 'test_helper'

class EarlTest < ActiveSupport::TestCase

  should_belong_to :user
  should_have_attached_file :logo

  should "be valid with factories" do
    assert_valid Factory.build(:earl)
    assert_valid Factory.create(:earl)
  end

  should_allow_values_for :name, "UPPERCASE", "testing", "test12-_."
  should_not_allow_values_for :name, Earl.reserved_names.first, Earl.reserved_names.last, "test12-_,.", "with space", "", "bals@bla", "test/this", "askdf|", "=sdkjfs", '+'

  should "validate uniqueness of name case insensitive" do
    e = Factory.create(:earl)
    assert_bad_value(Earl, :name, e.name.upcase)
    assert_bad_value(Earl, :name, e.name)
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

  should "find proper earl by name" do
    earl_names = ['slug.test', 'slug-test', 'S-TEST', 'S.TEST']
    earls = []
    earl_names.each do |name|
      earls << Factory.create(:earl, :name => name)
    end
    earl_names.each_with_index do |name, index|
      assert_equal Earl.find(name), earls[index]
    end
  end

  should "know if it needs verification" do
    e = Factory.create(:earl)
    assert_equal false, e.requires_verification?
    e.require_verification!
    assert_equal true, e.requires_verification?
  end

end

