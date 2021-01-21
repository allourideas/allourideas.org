require 'test_helper'

class EarlTest < ActiveSupport::TestCase

  should_belong_to :user
  should_have_attached_file :logo

  should "be valid with factories" do
    assert_valid Factory.build(:earl)
    assert_valid Factory.create(:earl)
  end

  should_allow_values_for :name, "UPPERCASE", "testing", "test12-_"
  should_not_allow_values_for :name, Earl.reserved_names.first, Earl.reserved_names.last, "test12-_,.", "with space", "", "bals@bla", "test/this", "askdf|", "=sdkjfs", '+', "test.123"

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

  should "allow redaction" do
    matt_admin = Factory :email_confirmed_user,
      :email => "mjs3@princeton.edu",
      :admin => true
    e = Factory.create(:earl)
    e.redact!
    assert_equal false, e.active
    assert_equal matt_admin.id, e.user_id
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
    earl_names = ['slugtest', 'slug-test', 'S-TEST', 'STEST']
    earls = []
    earl_names.each do |name|
      earls << Factory.create(:earl, :name => name)
    end
    earl_names.each_with_index do |name, index|
      assert_equal Earl.find(name), earls[index]
    end
  end

  should "successfully complete votes munge_csv_data" do
    earl = Factory.create(:earl)
    # This data is not specific for this Earl.
    # Just sending in some data to ensure code runs without errors.
    dummycsvdata = <<-EOS
Vote ID,Session ID,Wikisurvey ID,Winner ID,Winner Text,Loser ID,Loser Text,Prompt ID,Appearance ID,Left Choice ID,Right Choice ID,Created at,Updated at,Response Time (s),Missing Response Time Explanation,Session Identifier,Valid
136,54230,970,23773,Do you have any idea?,23772,What question should I create?,5020697,786,23773,23772,2010-10-29 13:38:33 UTC,2010-10-29 13:38:33 UTC,2.846,"",93aa75f3dd480185818af7420383a5b6,FALSE
    EOS
    earl.munge_csv_data(dummycsvdata, 'votes').each {|row| }
  end

  should "successfully complete non_votes munge_csv_data" do
    earl = Factory.create(:earl)
    # This data is not specific for this Earl.
    # Just sending in some data to ensure code runs without errors.
    dummycsvdata = <<-EOS
Record Type,Skip ID,Appearance ID,Session ID,Wikisurvey ID,Left Choice ID,Left Choice Text,Right Choice ID,Right Choice Text,Prompt ID,Reason,Created at,Updated at,Response Time (s),Missing Response Time Explanation,Session Identifier,Valid
Bounce,NA,247658,54059,970,23773,Do you have any idea?,23772,What question should I create?,5020697,NA,2010-10-18 15:05:26 UTC,2010-10-18 15:05:26 UTC,NA,"",a02b896a7fbddf4b43e4d42b2b03808e,TRUE
    EOS
    earl.munge_csv_data(dummycsvdata, 'non_votes').each {|row| }
  end

  should "successfully complete ideas munge_csv_data" do
    earl = Factory.create(:earl)
    # This data is not specific for this Earl.
    # Just sending in some data to ensure code runs without errors.
    dummycsvdata = <<-EOS
Wikisurvey ID,Idea ID,Idea Text,Wins,Losses,Times involved in Cant Decide,Score,User Submitted,Session ID,Created at,Last Activity,Active,Appearances on Left,Appearances on Right,Session Identifier
970,25635,inooinono n ino,14,6,1,68.1818,TRUE,54474,2011-04-27 13:47:29 UTC,2014-02-14 22:12:40 UTC,FALSE,12,20,f0cfbd2a0be32ca51a53d2e8f2e37757
    EOS
    earl.munge_csv_data(dummycsvdata, 'ideas').each {|row| }
  end

  should "know if it needs verification" do
    e = Factory.create(:earl)
    assert_equal false, e.requires_verification?
    e.require_verification!
    assert_equal true, e.requires_verification?
  end

end

