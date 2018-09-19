FactoryBot.define do
  factory :question do
    name 'What is this?'
    url 'testurl'
    created_at Time.now.utc
    updated_at Time.now.utc
    tracking nil
    prompts_count 90
    choices_count 10
    appearance_id "f72da54add43e5ca39cab80f1c72f0e7"
    picked_prompt_id "1"
    it_should_autoactivate_ideas true
    visitor_ideas "0"
    visitor_votes "0"
    inactive_choices_count 2
    information nil
    votes_count 1030
    uses_catchup true
    creator_id 54059
    version 1
    item_count 1010
    show_results true
    local_identifier "335"
    active false
    site_id 9
    recent_votes 1
    user_ideas 20
    active_user_ideas 10
  end

  sequence :question_id do |n|
    n
  end

  factory :question_cucumber, :class => Question do |q|
    name 'test name'
    url 'testurl'
    ideas "samplechoice1\nsamplechoice2"
  end
end

