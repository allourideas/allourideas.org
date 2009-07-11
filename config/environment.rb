# Be sure to restart your server when you modify this file

# Specifies gem version of Rails to use when vendor/rails is not present
RAILS_GEM_VERSION = '2.3.2' unless defined? RAILS_GEM_VERSION

# Bootstrap the Rails environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')

Rails::Initializer.run do |config|
  # Settings in config/environments/* take precedence over those specified here.

  config.time_zone = 'UTC'

  config.action_mailer.delivery_method = :smtp

  config.gem "ambethia-smtp-tls",
    :lib     => "smtp-tls",
    :version => "1.1.2",
    :source  => "http://gems.github.com"
  config.gem "tobi-delayed_job",
    :lib     => "delayed_job",
    :version => "1.7.0",
    :source  => "http://gems.github.com"
  config.gem "thoughtbot-paperclip",
    :lib     => "paperclip",
    :version => "2.2.9.2",
    :source  => "http://gems.github.com"
  config.gem "right_aws",
    :version => "1.10.0"
  config.gem "yfactorial-utility_scopes",
    :lib     => "utility_scopes",
    :version => "0.2.2",
    :source  => "http://gems.github.com"
end

