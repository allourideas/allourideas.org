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
bundle install
ls -l
pwd
rake db:create RAILS_ENV=production
rake db:schema:load RAILS_ENV=production
rake db:seed RAILS_ENV=production
sudo -u app bundle exec rake db:create RAILS_ENV=production
sudo -u app bundle exec rake db:schema:load RAILS_ENV=production
sudo -u app bundle exec rake db:seed RAILS_ENV=production

