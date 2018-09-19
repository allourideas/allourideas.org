require 'spec_helper'

describe Earl do
  let(:user) { create(:email_confirmed_user) }
  let(:valid_attributes) do
    {
      name: "value-for-name",
      question_id: 1,
      user: user,
    }
  end

  it "should create a new instance given valid attributes" do
    Earl.create!(valid_attributes)
  end
end
