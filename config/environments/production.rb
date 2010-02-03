# Settings specified here will take precedence over those in config/environment.rb

# The production environment is meant for finished, "live" apps.
# Code is not reloaded between requests
config.cache_classes = true

# Use a different logger for distributed setups
# config.logger = SyslogLogger.new

# Full error reports are disabled and caching is turned on
config.action_controller.consider_all_requests_local = false
config.action_controller.perform_caching             = true

# Enable serving of images, stylesheets, and javascripts from an asset server
# config.action_controller.asset_host                  = "http://assets.example.com"

# Disable delivery errors, bad email addresses will be ignored
config.action_mailer.raise_delivery_errors = false

config.gem "rubaidh-google_analytics",
  :lib     => "rubaidh/google_analytics",
  :version => "1.1.4",
  :source  => "http://gems.github.com"


#pains me to do this, but can't seem to get environment variables set in EY
#will change login after demo
HOST = 'http://www.allourideas.org' #"http://www.allourideas.org"
API_HOST = "http://allrideas.net"#"#ENV['PAIRWISE_API_HOST']
PAIRWISE_USERNAME = "pairwisetest@dkapadia.com"#ENV['PAIRWISE_USERNAME']
PAIRWISE_PASSWORD = "wheatthins"#ENV['PAIRWISE_PASSWORD']
