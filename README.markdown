Heroku's Suspenders
-------------------

thoughtbot's Suspenders modified for Heroku.

    git clone git://github.com/dancroak/heroku_suspenders.git
    cd heroku_suspenders
    ./script/create_project project_name

This will create a Rails 2.3.2 app with Heroku-recommended code:

* Paperclip for file uploads, set for Amazon S3
* Gmail SMTP for email
* Delayed Job for background processing
* Hoptoad Notifier for exception notification
* Google Analytics for usage analytics

... and some other opinions:

* jQuery for Javascript
* Clearance for authentication
* Cucumber, Shoulda, Factory Girl, & Mocha for testing
* Stylus for CSS framework
* Coulda for features, model, controller, & helper generators

Get the latest & greatest at anytime with:

    git pull heroku_suspenders master

A helper rake task will prompt you for all your production config vars (S3
keys, GMail account, Hoptoad API key...) and set them on your Heroku app:

    rake heroku:setup

More details available in doc/README_FOR_TEMPLATE.

Mascot
------

The official Suspenders mascot is Suspenders Boy:

![Suspenders Boy](http://media.tumblr.com/1TEAMALpseh5xzf0Jt6bcwSMo1_400.png)

