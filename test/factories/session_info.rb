Factory.define :session_info do |session_info|
  session_info.session_id 
  session_info.ip_addr 
  session_info.user_agent 
  session_info.loc_info { 'string' }
end
