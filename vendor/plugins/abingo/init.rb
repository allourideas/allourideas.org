require File.dirname(__FILE__) + '/lib/abingo'
if Rails::VERSION::MAJOR >= 3
  require File.dirname(__FILE__) + '/generators/abingo_migration/abingo_migration_generator.rb'
end

ActionController::Base.send :include, AbingoSugar

ActionView::Base.send :include, AbingoViewHelper