#! /bin/bash
mkdir -p /home/app
cd /home/app
git clone https://github.com/CitizensFoundation/allourideas.org.git
chown -R app:app /home/app/allourideas.org

cd /home/app/allourideas.org

ls -l
ls -l config

sudo -E -u app bundle install
sudo -E -u app bundle exec rake db:create RAILS_ENV=production
sudo -E -u app bundle exec rake db:schema:load RAILS_ENV=production
