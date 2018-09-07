source "https://rubygems.org"
source "http://gems.github.com"

gem "rails", "5.2.1"
gem "rake", "~> 12.3.1"
gem "multi_json", "1.13.1"
gem "json"
gem "libxml-ruby", "3.1.0", :require => "libxml"
#gem "ambethia-smtp-tls", "1.1.2", :require => "smtp-tls" # obsolete
#gem "paperclip", "~> 2.7.0" # obsolete
gem "aws-s3", "0.6.3", :require => "aws/s3"
gem "aws-sdk", "~> 3.0.1"
gem "mime-types", "3.2.2", :require => "mime/types"
gem "xml-simple", "1.1.5", :require => "xmlsimple"
# gem "yfactorial-utility_scopes", "0.2.2", :require => "utility_scopes" # obsolete
gem "formtastic"
gem "inherited_resources",  "1.9.0"
gem "has_scope",  "0.7.2"
gem "responders",  "2.4.0"
gem "clearance", "0.16.1", :require => "clearance"
gem "fastercsv", "1.5.5"
gem "redis-store", "1.5.0"
gem "redis", "~> 4.0.2"
# gem "system_timer", "~> 1.2.4"
gem "will_paginate", "3.1.6"
gem "geoip", "1.6.4"
gem "geokit", "1.13.1"
gem "friendly_id", "5.2.4"
gem "sax-machine", "1.3.2"
gem "i18n"
gem "delayed_job", "4.1.5"
gem "haml", "~> 5.0.4"
gem "compass-rails", "~> 3.1.0"
gem "mysql2", "0.5.2"
# gem "bugsnag", "~> 5.5.0"
gem "test-unit", "3.2.8"

group :development do
  #gem "engineyard", "~> 1.4.29"
end

group :production, :staging do
  gem "sendgrid", "1.2.4"
end

group :test, :cucumber do
  gem 'cucumber', '3.1.2'
  gem 'cucumber-rails', '~> 1.6.0'
  gem "pickle", "~> 0.5.5"
  gem "poltergeist", "~> 1.18.1"
  gem "sqlite3", ">=1.3.13"
  gem "database_cleaner", "1.7.0"
  gem "capybara", "~> 3.7.1"
  gem "factory_bot", "~>4.11.0"
  gem "shoulda", "~> 3.6.0"
  gem "timecop", "0.9.1"
  gem "rspec", "3.8.0"
  gem "rspec-rails", "3.8.0"
  gem "email_spec", "2.2.0"
  gem "sendgrid", "1.2.4"
  # gem "fakeweb", "~>1.2.5" # obsolete
  # gem "jferris-mocha", "0.9.5.0.1241126838", :require => "mocha" # obsolete
end
# gem "ey_config" # engine yard
# gem "newrelic_rpm"
