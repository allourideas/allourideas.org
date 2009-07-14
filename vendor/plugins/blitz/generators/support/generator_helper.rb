require File.join(File.dirname(__FILE__), "insert_commands")

module Blitz
  module GeneratorHelper
    REMOVABLE_COLUMNS = ["id", "created_at", "updated_at", "email_confirmed",
      "encrypted_password", "salt", "token", "token_expires_at"]

    def resource
      file_name.singularize
    end

    def resources
      file_name.pluralize
    end

    def resource_class
      class_name.singularize
    end

    def columns_for_form
      resource_class.constantize.columns.
        collect   { |column| name_and_type(column) }.
        delete_if { |column| remove_column?(column.first) }
    end

    def active_record_defined?
      models = Dir.glob(File.join( RAILS_ROOT, 'app', 'models', '*.rb')).
                   collect { |path| path[/.+\/(.+).rb/,1] }.
                   collect {|model| model.classify }
      models.include?(resource_class)
    end

    def belongs_to_column?(column_name)
      !(column_name =~ /_id$/).nil?
    end

    def name_and_type(column)
      if belongs_to_column?(column.name)
        [column.name.gsub("_id", ""), :collection]
      else
        [column.name, column.type]
      end
    end

    def remove_column?(column)
      REMOVABLE_COLUMNS.include?(column) ||
        !(column =~ /_count$/).nil?
    end
  end
end

class Rails::Generator::NamedBase
  include Blitz::GeneratorHelper
end

