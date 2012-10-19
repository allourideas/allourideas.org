require 'rubygems'
require 'rails'

if Rails::VERSION::MAJOR.to_i >= 3
  require 'rails/all'
  require 'test/unit'

  require 'active_support'
  require 'active_support/railtie'
  require 'active_support/core_ext'
  require 'active_support/test_case'

  require 'action_controller'
  require 'action_controller/caching'
  require 'active_record'
  require 'active_record/base'
  
  require 'rails'
  require 'rails/application'

  require 'rails/railtie'

  #We need to load the whole Rails application to properly initialize Rails.cache and other constants.  Oh boy.
  #We're going to parse it out of RAILS_PATH/config.ru using a little metaprogramming magic.
  require ::File.expand_path('../../../../../config/environment',  __FILE__)
  lines = File.open(::File.expand_path('../../../../../config.ru',  __FILE__)).readlines.select {|a| a =~ /::Application/}
  application_name = lines.first[/[^ ]*::/].gsub(":", "")
  Kernel.const_get(application_name).const_get("Application").initialize!
else
  #Rails 2 testing
  require 'active_support'
  require 'active_support/test_case'
end

