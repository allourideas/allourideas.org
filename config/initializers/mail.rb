# Use config vars to get your Gmail credentials onto Heroku.
# They will be automatically picked up by this file in production.

# heroku config:add GMAIL_EMAIL=dcroak@example.com GMAIL_PASSWORD=password

ActionMailer::Base.smtp_settings = {
 :address => "smtp.sendgrid.net",
  :port => '25',
  :authentication => :plain,
  :domain => "allourideas.org",
  :user_name => ENV['SENDGRID_USERNAME'],
  :password => ENV['SENDGRID_PASSWORD']
}

DO_NOT_REPLY = "info@allourideas.org"
MONITORS = ["info@allourideas.org"]
