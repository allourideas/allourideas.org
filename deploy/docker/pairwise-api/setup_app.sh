#! /bin/bash
mkdir -p /home/app
cd /home/app

if [ -d "/home/app/pairwise-api" ]
then
    chown -R root:root /home/app/pairwise-api
    cd /home/app/pairwise-api
    git pull
    chown -R app:app /home/app/pairwise-api
else
    git clone https://github.com/CitizensFoundation/pairwise-api.git
    chown -R app:app /home/app/pairwise-api
    cd /home/app/pairwise-api
fi

sudo -E -u app bundle install --path vendor/bundle
#sudo -E -u app bundle exec rake db:create RAILS_ENV=production
#sudo -E -u app bundle exec rake db:schema:load RAILS_ENV=production
#sudo -E -u app bundle exec rake db:seed RAILS_ENV=production
sudo -E -u app bundle exec rake db:migrate RAILS_ENV=production
true
