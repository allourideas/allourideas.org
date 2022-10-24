#! /bin/bash
chown -R app:app /root/pairwise-api
cd /root/pairwise-api
ls -l
pwd
sudo -u app bundle install --deployment --verbose
sudo -u app bundle exec rake db:create RAILS_ENV=production
sudo -u app bundle exec rake db:schema:load RAILS_ENV=production
sudo -u app bundle exec rake db:seed RAILS_ENV=production
