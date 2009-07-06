require File.join(File.dirname(__FILE__), "insert_commands")

module Coulda
  module GeneratorHelper
    REMOVABLE_COLUMNS = ["created_at", "updated_at", "email_confirmed",
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
      resource_class.content_columns.
        collect   { |column| [column.name, column.type] }.
        delete_if { |column| REMOVABLE_COLUMNS.include?(column.first) }
    end
  end
end

class Rails::Generator::NamedBase
  include Coulda::GeneratorHelper
end

