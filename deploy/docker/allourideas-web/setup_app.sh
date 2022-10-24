#! /bin/bash
chown -R app:app /root/allourideas.org
cd /root/allourideas.org
sudo -u app bundle install --deployment --verbose
sudo -u app bundle exec rake db:create RAILS_ENV=production
sudo -u app bundle exec rake db:schema:load RAILS_ENV=production
