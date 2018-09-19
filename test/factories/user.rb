FactoryBot.define do
  sequence :email do |n|
    "test@test.com" if n == 0 # some tests assume this is the email address
    "user#{n}@example.com" if n > 0
  end

  factory :user do
    email                 { generate :email }
    password              { "password" }
    # password_confirmation { "password" }
  end

  factory :email_confirmed_user, :parent => :user do
    email_confirmed { true }
  end

  factory :admin_confirmed_user, :parent => :email_confirmed_user do
    admin { true }
  end
end

