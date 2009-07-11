namespace :suspenders do
  desc "Pull the latest Heroku Suspenders"
  task :pull do
    `git pull heroku_suspenders master`
  end
end


