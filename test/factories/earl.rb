Factory.define :earl do |earl|
     earl.name "Test Question"	
     earl.question_id 1 # need to add a fixture for this
     earl.user {|u| u.association(:email_confirmed_user) }
end
