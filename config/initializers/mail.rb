config.action_mailer.delivery_method = :smtp

ActionMailer::Base.smtp_settings = {
  :tls            => true,
  :address        => "smtp.gmail.com",
  :port           => "587",
  :domain         => "heroku.com",
  :authentication => :plain,
  :user_name      => "YOUREMAIL",
  :password       => "YOURPASSWORD"
}

DO_NOT_REPLY = "donotreply@example.com"

