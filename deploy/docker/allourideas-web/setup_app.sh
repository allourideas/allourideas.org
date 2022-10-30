#! /bin/bash
mkdir -p /home/app
cd /home/app

if [ -d "/home/app/allourideas.org" ]
then
    chown -R root:root /home/app/allourideas.org
    cd /home/app/allourideas.org
    git pull
    chown -R app:app /home/app/allourideas.org
else
    git clone https://github.com/CitizensFoundation/allourideas.org.git
    chown -R app:app /home/app/allourideas.org
    cd /home/app/allourideas.org
fi

sudo -E -u app bundle install
sudo -E -u app bundle exec rake db:create RAILS_ENV=production
sudo -E -u app bundle exec rake db:schema:load RAILS_ENV=production
true
