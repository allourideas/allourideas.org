FactoryBot.define do
  factory :prompt do
    created_at Time.now.utc
    left_choice_id { generate :choice_id }
    left_choice_text {|a| "left choice text #{a.left_choice_id}" }
    updated_at Time.now.utc
    tracking nil
    votes_count 0
    right_choice_id { generate :choice_id }
    right_choice_text {|a| "right choice text #{a.right_choice_id}" }
    question_id 1
  end
end

