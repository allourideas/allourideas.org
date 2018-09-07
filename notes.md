# rails 2.3
## downgrade gem
gem update --system 1.8.25
rvm install rubygems 1.8.25 --force

## start server
./script/server


## slow webrick
Having the same issue here (even a year later). Under linux you have to do the following:
Look for the file /usr/lib/ruby/1.9.1/webrick/config.rb and edit it.
Replace the line
:DoNotReverseLookup => nil,
with
:DoNotReverseLookup => true,
Restart webrick and it'll work like a charm :)

## create user
./script/console
>> User.find_or_create_by_email(:email => 'aivils@ithouse.lv', :password => '12345678', :password_confirmation => '12345678')



## run tests

ruby -I. `which spec` spec
