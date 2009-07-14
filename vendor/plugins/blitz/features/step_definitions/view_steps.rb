When /^I generate a "([^\"]*)" view for "([^\"]*)"$/ do |view, resource|
  system "cd #{@rails_root} && " <<
         "script/generate view #{resource} #{view} && " <<
         "cd .."
end

When /^I generate a "([^\"]*)" view for "([^\"]*)" with the empty option$/ do |view, resource|
  system "cd #{@rails_root} && " <<
         "script/generate view #{resource} #{view} --empty && " <<
         "cd .."
end

When /^a SemiFormal "new" view for "posts" should be generated$/ do
  assert_generated_file("app/views/posts/new.html.erb") do
    "<h1>New post</h1>\n\n"                                                <<
    "<% form_for(@post) do |form| %>\n"                                    <<
    "  <%= form.error_messages %>\n"                                       <<
    "  <fieldset class=\"inputs\">\n"                                      <<
    "  </fieldset>\n"                                                      <<
    "  <fieldset class=\"buttons\">\n"                                     <<
    "    <%= form.submit 'Create', :disable_with => 'Please wait...' %>\n" <<
    "  </fieldset>\n"                                                      <<
    "<% end %>"
  end
end

Then /^a SemiFormal "new" view for "posts" should be generated with fields$/ do
  assert_generated_file("app/views/posts/new.html.erb") do
    "<h1>New post</h1>\n\n"                                                <<
    "<% form_for(@post) do |form| %>\n"                                    <<
    "  <%= form.error_messages %>\n"                                       <<
    "  <fieldset class=\"inputs\">\n"                                      <<
    "    <%= form.string :title %>\n"                                      <<
    "    <%= form.text :body %>\n"                                         <<
    "    <%= form.collection :user %>\n"                                   <<
    "  </fieldset>\n"                                                      <<
    "  <fieldset class=\"buttons\">\n"                                     <<
    "    <%= form.submit 'Create', :disable_with => 'Please wait...' %>\n" <<
    "  </fieldset>\n"                                                      <<
    "<% end %>"
  end
end

Then /^an empty "new" view for "posts" should be generated$/ do
  assert_generated_empty_file("app/views/posts/new.html.erb")
end

