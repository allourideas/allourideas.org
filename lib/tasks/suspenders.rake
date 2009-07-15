namespace :suspenders do
  desc "Pull the latest Heroku Suspenders"
  task :pull do
    remote  = "heroku_suspenders"
    source  = "git://github.com/dancroak/heroku_suspenders.git"
    remotes = `git remote show`
    unless remotes.split("\n").include?(remote)
      `git remote add #{remote} #{source}`
    end
    `git pull #{remote} master`
  end
end

