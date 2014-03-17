run "echo 'release_path: #{config.release_path}/db/GeoIPCity.dat' >> #{config.shared_path}/logs.log"
run "ln -nfs #{config.shared_path}/GeoLiteCity.dat #{config.release_path}/db/GeoLiteCity.dat"

if FileTest.exists?("#{config.shared_path}/config/redis.yml")
  run "ln -nfs #{config.shared_path}/config/redis.yml #{config.release_path}/config/redis.yml"
end
