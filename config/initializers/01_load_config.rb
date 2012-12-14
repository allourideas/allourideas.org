extra_conf = "/data/extra-conf/environment-variables.rb"
if File.exists?(extra_conf)
   require extra_conf
end

APP_CONFIG = YAML.load(ERB.new(IO.read("#{RAILS_ROOT}/config/config.yml")).result)[RAILS_ENV].symbolize_keys
