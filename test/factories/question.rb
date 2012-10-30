Factory.define :question do |q|
  q.name 'What is this?'
  q.url 'testurl'
  q.created_at Time.now.utc
  q.updated_at Time.now.utc
  q.tracking nil
  q.prompts_count 90
  q.choices_count 10
  q.appearance_id "f72da54add43e5ca39cab80f1c72f0e7"
  q.picked_prompt_id "1"
  q.it_should_autoactivate_ideas true
  q.visitor_ideas "0"
  q.visitor_votes "0"
  q.inactive_choices_count 2
  q.information nil
  q.votes_count 1030
  q.uses_catchup true
  q.creator_id 54059
  q.version 1
  q.item_count 1010
  q.show_results true
  q.local_identifier "335"
  q.active false
  q.site_id 9
end

Factory.sequence :question_id do |n|
  n
end

Factory.define :question_cucumber, :class => Question do |q|
  q.name 'test name'
  q.url 'testurl'
  q.ideas "samplechoice1\nsamplechoice2"
end
