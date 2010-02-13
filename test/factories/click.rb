Factory.define :click do |click|
  click.sid 
  click.user_id 
  click.ip_addr 
  click.controller 
  click.action 
  click.url { 'string' }
end
