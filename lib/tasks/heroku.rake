require "rake"

namespace :heroku do
  def ask_yn(q)
    print "#{q} (y/n) "
    STDIN.gets.strip.downcase.slice(0, 1) == "y"
  end

  def ask_value(q)
    print "  #{q}: "
    STDIN.gets.strip
  end

  desc "Prompt for all the config vars and set them on the Heroku app"
  task :setup => :create do
    vars = {}

    if ask_yn("Use Amazon S3 for Paperclip uploads?")
      vars[:S3_KEY] = ask_value("S3 key")
      vars[:S3_SECRET] = ask_value("S3 secret key")
      vars[:S3_BUCKET] = ask_value("S3 bucket")
    end

    if ask_yn("Use Google Analytics to track web traffic?")
      vars[:GOOGLE_ANALYTICS_TRACKER_ID] = ask_value("Google Analytics tracker id")
    end

    if ask_yn("Use Hoptoad for exception notifications?")
      vars[:HOPTOAD_API_KEY] = ask_value("Hoptoad API key")
    end

    if ask_yn("Use GMail to send outgoing emails?")
      vars[:GMAIL_EMAIL] = ask_value("GMail email address")
      vars[:GMAIL_PASSWORD] = ask_value("GMail password")
    end

    puts "Setting all config vars on Heroku app"
    if vars.any?
      vars_string = vars.map { |k, v| "#{k}='#{v}'" }.join(" ")
      `heroku config:add #{vars_string}`
    end

    puts "Deploying..."
    `git push heroku master`
    `heroku rake db:migrate`

    puts "Opening app..."
    `heroku open`

    puts "Rename your app at any time with..."
    puts "heroku rename newname"
  end

  desc "Create a new app"
  task :create => :dependencies do
    `cd #{Rails.root} && git remote -v | grep git@heroku.com`
    unless $?.success?
      puts "It doesn't look like this is a Heroku app (no git remote)."
      exit 1 unless ask_yn("Would you like to create a Heroku app now?")
      `heroku create`
    end
  end

  desc "Deploy to heroku"
  task :deploy => :dependencies do
    `git push heroku`
    `heroku rake db:migrate`
    `heroku rake hoptoad:deploy TO=#{Rails.env}`
  end

  task :dependencies do
    `heroku`
    unless $?.success?
      puts "Heroku gem is not installed.  Try: sudo gem install heroku"
      exit 1
    end

    `cd #{Rails.root} && ls .git/config`
    unless $?.success?
      puts "This doesn't appear to be a git repo.  Try: git init"
      exit 1
    end
  end
end
