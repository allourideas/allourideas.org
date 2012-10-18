Factory.define :prompt do |p|
  p.created_at Time.now.utc
  p.left_choice_id { Factory.next :choice_id }
  p.left_choice_text {|a| "left choice text #{a.left_choice_id}" }
  p.updated_at Time.now.utc
  p.tracking nil
  p.votes_count 0
  p.right_choice_id { Factory.next :choice_id }
  p.right_choice_text {|a| "right choice text #{a.right_choice_id}" }
  p.question_id 1
end

Factory.sequence :choice_id do |n|
  n
end
