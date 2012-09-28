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

Bundler.require :default, 'test'

require 'redis-store'
#use a different redis store for testing
Abingo.cache = ActiveSupport::Cache::RedisStore.new "redis://localhost:6379/2"
Abingo.cache.clear
