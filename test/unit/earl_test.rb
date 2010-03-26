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


end

