Clearance.configure do |config|
  config.allow_sign_up = true
  config.cookie_domain = ".example.com"
  config.cookie_expiration = lambda { |cookies| 1.year.from_now.utc }
  config.cookie_name = "remember_token"
  config.cookie_path = "/"
  config.routes = true
  config.httponly = true
  config.mailer_sender = "reply@example.com"
  config.password_strategy = Clearance::PasswordStrategies::BCrypt
  config.redirect_url = "/"
  config.rotate_csrf_on_sign_in = true
  config.same_site = nil
  config.secure_cookie = false
  config.signed_cookie = false
  config.sign_in_guards = []
  config.user_model = "User"
  config.parent_controller = "ApplicationController"
  config.sign_in_on_password_reset = false
end