#! /bin/bash
mkdir -p /home/app
cd /home/app
git clone https://github.com/CitizensFoundation/pairwise-api.git
chown -R app:app /home/app/pairwise-api

cd /home/app/pairwise-api

ls -l
ls -l config

sudo -u app bundle install
sudo -u app bundle exec rake db:create RAILS_ENV=production
sudo -u app bundle exec rake db:schema:load RAILS_ENV=production
sudo -u app bundle exec rake db:seed RAILS_ENV=production

bundle install
bundle exec rake db:create RAILS_ENV=production
bundle exec rake db:schema:load RAILS_ENV=production
bundle exec rake db:seed RAILS_ENV=production
