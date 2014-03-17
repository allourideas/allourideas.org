Factory.define :choice do |c|
  c.created_at Time.now.utc
  c.updated_at Time.now.utc
  c.active true
  c.creator_id 1
  c.data { "test choice #{Factory.next :choice_id}" }
  c.question_id 1
  c.loss_count 3
  c.losses 3
end

Factory.sequence :choice_id do |n|
  n
end
