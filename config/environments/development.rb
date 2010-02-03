# Settings specified here will take precedence over those in config/environment.rb

# In the development environment your application's code is reloaded on
# every request.  This slows down response time but is perfect for development
# since you don't have to restart the webserver when you make code changes.
config.cache_classes = false

# Log error messages when you accidentally call methods on nil.
config.whiny_nils = true

# Show full error reports and disable caching
config.action_controller.consider_all_requests_local = true
config.action_controller.perform_caching             = false
config.action_view.debug_rjs                         = true

# Don't care if the mailer can't send
config.action_mailer.raise_delivery_errors = false

HOST = 'http://localhost:3001'
#API_HOST = "http://204.236.224.252"
#API_HOST = 'http://allourideas.com'
API_HOST = "http://localhost:3000"

PAIRWISE_USERNAME = "pairwisetest@dkapadia.com"
PAIRWISE_PASSWORD = "wheatthins"
