# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require(File.join(File.dirname(__FILE__), 'config', 'boot'))

require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

require 'tasks/rails'
#require 'bugsnag/tasks'

task :default => [:test, :features]

begin
    require 'delayed_job'
	  require 'delayed/tasks'
rescue LoadError
	  STDERR.puts "Run `rake gems:install` to install delayed_job"
end
#autoload :Delayed, 'delayed_job'
