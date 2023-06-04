Clearance.configure do |config|
  config.routes = false
  config.mailer_sender = ENV["INFO_ALLOURIDEAS_EMAIL"]
  config.rotate_csrf_on_sign_in = true
end
