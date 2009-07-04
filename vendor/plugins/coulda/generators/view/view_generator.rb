class ViewGenerator < Rails::Generator::NamedBase
  def manifest
    record do |m|
      m.directory File.join('app/views', class_path, file_name)
      m.directory 'features'

      if actions.include?("new")
        path = File.join('app/views', class_path, file_name, "new.html.erb")
        m.template 'view_new.html.erb', path

        path = File.join('features', "#{file_name.pluralize}.feature")
        m.template 'feature.feature', path
      end
    end
  end
end
