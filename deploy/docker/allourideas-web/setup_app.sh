#! /bin/bash
chown -R app:app /root/allourideas.org
cd /root/allourideas.org
cd /root
ls -l
cd /root/allourideas.org
ls -l
pwd
sudo su app
cd /root/allourideas.org
pwd
bundle install
rake db:create RAILS_ENV=production
rake db:schema:load RAILS_ENV=production

