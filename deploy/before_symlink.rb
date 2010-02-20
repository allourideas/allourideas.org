run "echo 'release_path: #{release_path}/db/GeoIPCity.dat' >> #{shared_path}/logs.log"
run "ln -nfs #{shared_path}/GeoLiteCity.dat #{release_path}/db/GeoLiteCity.dat"
