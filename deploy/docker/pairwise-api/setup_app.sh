#! /bin/bash
mkdir -p /home/app
cd /home/app

rm -r pairwise-api

git clone https://github.com/CitizensFoundation/pairwise-api.git
chown -R app:app /home/app/pairwise-api

cd /home/app/pairwise-api

ls -l
ls -l config

sudo -E -u app bundle install
sudo -E -u app bundle exec rake db:create RAILS_ENV=production
sudo -E -u app bundle exec rake db:schema:load RAILS_ENV=production
sudo -E -u app bundle exec rake db:seed RAILS_ENV=production
true
