When /^I generate a "([^\"]*)" view for "([^\"]*)"$/ do |view, resource|
  system "cd #{@rails_root} && " <<
         "script/generate view #{resource} #{view} && " <<
         "cd .."
end

When /^a standard "new" view for "posts" should be generated$/ do
  assert_generated_file("app/views/posts/new.html.erb") do |body|
    expected = "<h1>New post</h1>\n\n" <<
               "<% form_for(@post) do |form| %>\n" <<
               "  <%= form.error_messages %>\n" <<
               "  <%= form.submit 'Create', :disable_with => 'Please wait...' %>\n" <<
               "<% end %>"
    assert body.include?(expected), 
      "expected #{expected} but was #{body.inspect}"
  end
end

