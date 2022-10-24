#! /bin/bash
chown -R app:app /root/pairwise-api
cd /root
ls -l
cd /root/pairwise-api
ls -l
cd /root/pairwise-api
pwd
ls -l
pwd
sudo -u app bash -c "cd /root/pairwise-api;bundle install"
sudo -u app bash -c "cd /root/pairwise-api;bundle exec rake db:create RAILS_ENV=production"
sudo -u app bash -c "cd /root/pairwise-api;bundle exec rake db:schema:load RAILS_ENV=production"
sudo -u app bash -c "cd /root/pairwise-api;bundle exec rake db:seed RAILS_ENV=production"

