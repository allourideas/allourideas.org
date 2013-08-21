Factory.define :blocked_cookies do |blocked_cookies|
  blocked_cookies.referrer { 'string' }
  blocked_cookies.question_id { 1 }
  blocked_cookies.user_agent { 'string' }
  blocked_cookies.ip_addr { 'string' }
  blocked_cookies.source { 'string' }
end
