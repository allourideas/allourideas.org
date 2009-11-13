require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Earl do
  before(:each) do
    @valid_attributes = {
      :name => "value for name",
      :question_id => 1
    }
  end

  it "should create a new instance given valid attributes" do
    Earl.create!(@valid_attributes)
  end
end
