require File.join(File.dirname(__FILE__), "..", "support", "generator_helper")

class FunctionalTestGenerator < Rails::Generator::NamedBase
  def manifest
    record do |m|
      m.class_collisions "#{class_name}ControllerTest"

      m.directory File.join('test/functional', class_path)

      m.template 'functional_test.rb',
                  File.join('test/functional',
                            class_path,
                            "#{file_name}_controller_test.rb")
    end
  end
end

