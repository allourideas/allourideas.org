#require 'sendgrid-ruby'

#SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])

ActionMailer::Base.smtp_settings = {
  :address => "smtp.sendgrid.net",
  :port => 587,
  :authentication => :plain,
  :enable_starttls_auto => true,
  :domain => ENV["SENDGRID_DOMAIN"],
  :user_name => "apikey",
  :password => ENV["SENDGRID_API_KEY"],
}

