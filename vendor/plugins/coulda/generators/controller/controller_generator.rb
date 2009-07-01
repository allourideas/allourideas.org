require File.join(File.dirname(__FILE__), "..", "support", "insert_commands")

class ControllerGenerator < Rails::Generator::NamedBase
  def manifest
    record do |m|
      m.class_collisions "#{class_name}Controller", "#{class_name}ControllerTest"

      m.directory File.join('app/controllers', class_path)
      m.directory File.join('test/functional', class_path)

      m.template 'controller.rb',
                  File.join('app/controllers',
                            class_path,
                            "#{file_name}_controller.rb")

      m.template 'functional_test.rb',
                  File.join('test/functional',
                            class_path,
                            "#{file_name}_controller_test.rb")

      m.insert_into "config/routes.rb",
                    "map.resources :#{file_name}, :only => [#{routeable_actions}]"
    end
  end

  def routeable_actions
    actions.collect { |action| ":#{action}" }.join(", ")
  end
end
