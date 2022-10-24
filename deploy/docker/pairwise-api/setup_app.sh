#! /bin/bash
chown -R app:app /home/app/pairwise-api
cd /home/app/pairwise-api

sudo -u app bundle install
sudo -u app bundle exec rake db:create RAILS_ENV=production
sudo -u app bundle exec rake db:schema:load RAILS_ENV=production
sudo -u app bundle exec rake db:seed RAILS_ENV=production
