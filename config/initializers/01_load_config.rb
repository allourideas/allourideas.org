#extra_conf = "/data/extra-conf/environment-variables.rb"
#if File.exists?(extra_conf)
#   require extra_conf
#end

#APP_CONFIG = YAML.load(ERB.new(IO.read("#{RAILS_ROOT}/config/config.yml")).result)[Rails.env].symbolize_keys
#TODO: Look at this file and see if it's still needed.
ActiveSupport::SecureRandom = SecureRandom

puts "URL OPTIONS"
puts Rails.application.routes.default_url_options
#puts Rails.application.routes.default_url_options = "localhost:3000"
