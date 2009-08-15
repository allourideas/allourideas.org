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

* jQuery for Javascript and Ajax
* Clearance for authentication
* Active Merchant for payment processing
* Cucumber, Shoulda, Factory Girl, & Mocha for testing
* Inherited Resources for RESTful controllers
* Formtastic for form builders
* Flutie for CSS framework
* Blitz for features, model, controller, & helper generators

If you don't have all the necessary gems, they will be installed.

Get the latest & greatest at anytime with:

    rake suspenders:pull

A helper rake task will prompt you for all your production config vars (S3
keys, GMail account, Hoptoad API key...) and set them on your Heroku app:

    rake heroku:setup

More details available in doc/README_FOR_TEMPLATE.

Mascot
------

The official Suspenders mascot is Suspenders Boy:

![Suspenders Boy](http://media.tumblr.com/1TEAMALpseh5xzf0Jt6bcwSMo1_400.png)

