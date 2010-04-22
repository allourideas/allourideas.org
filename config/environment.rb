# Be sure to restart your server when you modify this file

# Specifies gem version of Rails to use when vendor/rails is not present
RAILS_GEM_VERSION = '2.3.5' unless defined? RAILS_GEM_VERSION

# Bootstrap the Rails environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')

Rails::Initializer.run do |config|
  # Settings in config/environments/* take precedence over those specified here.

#  config.time_zone = 'Eastern Time (US & Canada)'
  config.active_record.default_timezone = 'Eastern Time (US & Canada)'

  config.action_mailer.delivery_method = :sendmail
  config.gem 'hoptoad_notifier', 
	  :version => '2.2.2'
  config.gem "ambethia-smtp-tls",
    :lib     => "smtp-tls",
    :version => "1.1.2",
    :source  => "http://gems.github.com"
#  config.gem "thoughtbot-paperclip",
#    :lib     => "paperclip",
#    :version => "2.3.1",
#    :source  => "http://gems.github.com"
  config.gem "paperclip",
    :lib => 'paperclip',
    :source  => "http://gemcutter.org"
#  config.gem "aws-s3",
#    :lib     => "aws/s3",
#    :version => "0.6.2"
  config.gem "mime-types",
    :lib     => "mime/types",
    :version => "1.16"
  config.gem "xml-simple",
    :lib     => "xmlsimple",
    :version => "1.0.12"
  config.gem "yfactorial-utility_scopes",
    :lib     => "utility_scopes",
    :version => "0.2.2",
    :source  => "http://gems.github.com"
  config.gem "justinfrench-formtastic", 
    :lib     => 'formtastic', 
    :source  => 'http://gems.github.com',
    :version => '0.2.2'
  config.gem "josevalim-inherited_resources", 
    :lib     => 'inherited_resources', 
    :source  => 'http://gems.github.com',
    :version => '0.9.1'
  config.gem "thoughtbot-clearance", 
    :lib     => 'clearance', 
    :source  => 'http://gems.github.com', 
    :version => '0.8.2'
  config.gem "activemerchant",
    :lib     => 'active_merchant',
    :version => '1.4.2'
  config.gem "fastercsv",
    :lib     => 'fastercsv',
    :version => '1.5.1'
    
  config.gem "ezmobius-redis-rb",
    :lib => false,
    :source  => 'http://gems.github.com'

  config.gem  'jodosha-redis-store',
    :source => 'http://gems.github.com',
    :lib => 'redis-store'

  config.gem 'geoip_city'
  config.gem 'geokit'

  config.gem 'crack'
  config.gem 'friendly_id'
  config.gem 'sax-machine'
  config.gem 'i18n'
  config.gem 'delayed_job'
end

PRODUCTION_API_HOST = ENV['API_HOST']
STAGING_API_HOST = ENV['STAGING_API_HOST']
