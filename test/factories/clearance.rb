Factory.sequence :email do |n|
  "test@test.com" if n == 0 # some tests assume this is the email address
  "user#{n}@example.com" if n > 0
end

Factory.define :user do |user|
  user.email                 { Factory.next :email }
  user.password              { "password" }
  user.password_confirmation { "password" }
end

Factory.define :email_confirmed_user, :parent => :user do |user|
  user.email_confirmed { true }
end
