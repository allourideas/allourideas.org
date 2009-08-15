When /^I attach an? "([^\"]*)" "([^\"]*)" file to an? "([^\"]*)" on S3$/ do |filename, extension, klass|
  filename   = filename.to_sym
  definition = klass.gsub(" ", "_").classify.constantize.attachment_definitions[filename]

  path = "http://s3.amazonaws.com/:id/#{definition[:path]}"
  path.gsub!(/:([^\/\.]+)/) do |match|
    "([^\/\.]+)"
  end

  FakeWeb.register_uri(:put, Regexp.new(path), :body => "OK")

  attach_file filename,
              "features/support/paperclip/#{klass.gsub(" ", "_").underscore}/#{filename}.#{extension}"
end

