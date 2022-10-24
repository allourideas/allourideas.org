#! /bin/bash
chown -R app:app /root/pairwise-api
cd /root
ls -l
cd /root/pairwise-api
ls -l
pwd
sudo su app
cd /root/pairwise-api
pwd
bundle install --verbose
bundle exec rake db:create RAILS_ENV=production
bundle exec rake db:schema:load RAILS_ENV=production
bundle exec rake db:seed RAILS_ENV=production
