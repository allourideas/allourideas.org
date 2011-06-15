# Edit at your own peril - it's recommended to regenerate this file
# in the future when you upgrade to a newer version of Cucumber.

# IMPORTANT: Setting config.cache_classes to false is known to
# break Cucumber's use_transactional_fixtures method.
# For more information see https://rspec.lighthouseapp.com/projects/16211/tickets/165
config.cache_classes = true

# Log error messages when you accidentally call methods on nil.
config.whiny_nils = true

# Show full error reports and disable caching
config.action_controller.consider_all_requests_local = true
config.action_controller.perform_caching             = false

# Disable request forgery protection in test environment
# THIS IS IMPORTANT
config.action_controller.allow_forgery_protection    = true

# Tell Action Mailer not to deliver emails to the real world.
# The :test delivery method accumulates sent emails in the
# ActionMailer::Base.deliveries array.
config.action_mailer.delivery_method = :test

config.gem 'cucumber-rails',   :lib => false, :version => '0.3.0' unless File.directory?(File.join(Rails.root, 'vendor/plugins/cucumber-rails'))
config.gem 'database_cleaner', :lib => false, :version => '0.5.0' unless File.directory?(File.join(Rails.root, 'vendor/plugins/database_cleaner'))
#config.gem 'webrat',           :lib => false, :version => '>=0.7.0' unless File.directory?(File.join(Rails.root, 'vendor/plugins/webrat'))
config.gem 'capybara',         :lib => false, :version => '0.3.7' unless File.directory?(File.join(Rails.root, 'vendor/plugins/capybara'))
config.gem 'rspec',            :lib => false, :version => '1.3.2' unless File.directory?(File.join(Rails.root, 'vendor/plugins/rspec'))
config.gem 'rspec-rails',      :lib => false, :version => '1.3.4' unless File.directory?(File.join(Rails.root, 'vendor/plugins/rspec-rails'))
config.gem 'email_spec', :lib => 'email_spec', :version => '0.4.0'
config.gem 'timecop',                         :version => '0.3.5'

config.gem 'sendgrid',
	  :version => '0.1.4'

require 'factory_girl'
require 'shoulda'

HOST = "localhost"
# Use a different test database / server for test purposes
API_HOST = "http://localhost:4000" 
#
PAIRWISE_USERNAME = "testing@dkapadia.com"
PAIRWISE_PASSWORD = "wheatthins"
PHOTOCRACY_USERNAME = "photocracytest@dkapadia.com"
PHOTOCRACY_PASSWORD = "saltines"
IP_ADDR_HASH_SALT = '2039d9ds9ufsdioh2394230' #prevent dictionary attacks on stored ip address hashes

PHOTOCRACY_HOST = 'photocracy.org'

require 'redis-store'
#use a different redis store for testing
Abingo.cache = ActiveSupport::Cache::RedisStore.new "localhost:6379/2"
Abingo.cache.clear
