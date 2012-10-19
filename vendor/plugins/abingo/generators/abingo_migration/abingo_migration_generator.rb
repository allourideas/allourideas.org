if Rails::VERSION::MAJOR == 2
  class AbingoMigrationGenerator < Rails::Generator::Base
    def manifest
      record do |m|
        m.migration_template 'abingo_migration.rb', 'db/migrate',
          :assigns => {:version => Abingo.MAJOR_VERSION.gsub(".", "")}
      end
    end

    def file_name
      "abingo_migration_#{Abingo.MAJOR_VERSION.gsub(".", "_")}"
    end
  end
else
  require 'rails/generators'
  require 'rails/generators/active_record'
  class AbingoMigrationGenerator < Rails::Generators::Base
    include Rails::Generators::Migration

    source_root File.expand_path('../templates', __FILE__)

    def self.next_migration_number(dirname) #:nodoc:
      next_migration_number = current_migration_number(dirname) + 1
      if ActiveRecord::Base.timestamped_migrations
        [Time.now.utc.strftime("%Y%m%d%H%M%S"), "%.14d" % next_migration_number].max
      else
        "%.3d" % next_migration_number
      end
    end

    def version
      Abingo.MAJOR_VERSION.gsub(".", "")
    end

    def copy_migration
      migration_template 'abingo_migration.rb', "db/migrate/abingo_migration#{version}"
    end
  end
end