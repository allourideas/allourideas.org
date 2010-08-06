Factory.define :earl do |earl|
     earl.name { Factory.next :earl_url }
     earl.question_id 1 # need to add a fixture for this
     earl.user {|u| u.association(:email_confirmed_user) }
end

Factory.sequence :earl_url do |n|
  "test_url_#{n}"
end
