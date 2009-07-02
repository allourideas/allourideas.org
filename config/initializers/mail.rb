require 'smtp-tls'

ActionMailer::Base.smtp_settings = {
  :address        => "smtp.gmail.com",
  :port           => "587",
  :authentication => :plain,
  :user_name      => "YOUREMAIL",
  :password       => "YOURPASSWORD"
}

DO_NOT_REPLY = "donotreply@example.com"

