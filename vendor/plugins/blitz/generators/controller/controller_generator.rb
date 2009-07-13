require File.join(File.dirname(__FILE__), "..", "support", "generator_helper")

class ControllerGenerator < Rails::Generator::NamedBase
  def manifest
    record do |m|
      m.class_collisions "#{class_name}Controller"

      m.directory File.join('app/controllers', class_path)

      m.template 'controller.rb',
                  File.join('app/controllers',
                            class_path,
                            "#{file_name}_controller.rb")
    end
  end
end
