FactoryBot.define do
  factory :earl do
    name { generate :earl_url }
    question_id 1 # need to add a fixture for this
    association :user, factory: :email_confirmed_user
  end

  sequence :earl_url do |n|
    "test_url_#{n}"
  end
end

