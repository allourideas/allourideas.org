FactoryBot.define do
  factory :choice do
    created_at Time.now.utc
    updated_at Time.now.utc
    active true
    creator_id 1
    data { "test choice #{generate :choice_id}" }
    question_id 1
    loss_count 3
    losses 3
  end

  sequence :choice_id do |n|
    n
  end
end

