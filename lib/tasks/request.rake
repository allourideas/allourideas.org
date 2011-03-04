namespace :request do
  desc "Trigger a request to the application"
  task :trigger => :environment do
    app = ActionController::Integration::Session.new
    app.get(ENV['url'])
    output = app.html_document.root.to_s
    puts output
  end
end
