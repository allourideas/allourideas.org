require File.join(File.dirname(__FILE__), "..", "support", "generator_helper")

class ViewGenerator < Rails::Generator::NamedBase
  default_options :empty => false

  def manifest
    record do |m|
      m.directory File.join('app/views', class_path, file_name)

      if actions.include?("new")
        path = File.join('app/views', class_path, file_name, "new.html.erb")
        if options[:empty]
          m.file 'empty.html.erb', path
        else
          m.template 'new.html.erb', path
        end
      elsif actions.include?("index")
        path = File.join('app/views', class_path, file_name,
                         "index.html.erb")
        m.template "index.html.erb", path
      end
    end
  end

  def add_options!(opt)
    opt.on('-e', '--empty') { options[:empty] = true }
  end
end
