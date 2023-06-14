Bugsnag.configure do |config|
  config.api_key = ENV['AOI_BUGSNAG_API_KEY']
  config.add_on_error(proc { |report|
    if report.error_class == 'AbstractController::ActionNotFound'
      report.ignore!
    end
  })
  config.auto_capture_sessions = false
end
