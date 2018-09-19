FactoryBot.define do
  factory :blocked_cookies do
    referrer { 'string' }
    question_id { 1 }
    user_agent { 'string' }
    ip_addr { 'string' }
    source { 'string' }
  end
end
