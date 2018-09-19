require 'capybara/rails'
require 'capybara/rspec'
require 'capybara/poltergeist'

Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new(
    app,
    timeout: 5.minutes,
    phantomjs_options: ['--load-images=no'],
    js_errors: false
  )
end

Capybara.javascript_driver = :poltergeist

RSpec.configure do |config|
  config.around(:example, :patient) do |example|
    seconds = example.metadata[:wait_time] || 10
    Capybara.using_wait_time(seconds) { example.run }
  end
end

if false
  require 'capybara-screenshot/rspec'
  Capybara::Screenshot.autosave_on_failure = true
end

