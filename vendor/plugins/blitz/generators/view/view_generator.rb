require File.join(File.dirname(__FILE__), "..", "support", "generator_helper")

class ViewGenerator < Rails::Generator::NamedBase
  def manifest
    record do |m|
      m.directory File.join('app/views', class_path, file_name)

      if actions.include?("new")
        path = File.join('app/views', class_path, file_name, "new.html.erb")
        m.template 'view_new.html.erb', path
      end
    end
  end
end
