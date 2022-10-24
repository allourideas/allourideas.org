#! /bin/bash
chown -R app:app /root/pairwise-api
cd /root
ls -la
cd /root/pairwise-api
ls -la
cd /root/pairwise-api
pwd
ls -la
pwd
sudo -u app pwd
sudo -u app bundle install
sudo -u app bash -c "cd /root/pairwise-api;bundle exec rake db:create RAILS_ENV=production"
sudo -u app bash -c "cd /root/pairwise-api;bundle exec rake db:schema:load RAILS_ENV=production"
sudo -u app bash -c "cd /root/pairwise-api;bundle exec rake db:seed RAILS_ENV=production"

