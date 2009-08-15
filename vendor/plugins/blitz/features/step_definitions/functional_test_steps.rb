When /^I generate a "(.*)" functional test with "(.*)" action$/ do |controller, action|
  system "cd #{@rails_root} && " <<
         "script/generate functional_test #{controller} #{action} && " <<
         "cd .."
end

Then /^a standard "index" functional test for "posts" should be generated$/ do
  assert_generated_file("test/functional/posts_controller_test.rb") do
    "  context 'GET to index' do\n"         <<
    "    setup { get :index }\n\n"          <<
    "    should_render_template :index\n"   <<
    "    should_respond_with    :success\n" <<
    "  end"
  end
end

Then /^an empty "index" controller action for "posts" should be generated$/ do
  assert_generated_file("app/controllers/posts_controller.rb") do
    "  def index\n" <<
    "  end"
  end
end

Then /^a standard "new" functional test for "posts" should be generated$/ do
  assert_generated_file("test/functional/posts_controller_test.rb") do
    "  context 'GET to new' do\n"           <<
    "    setup { get :new }\n\n"            <<
    "    should_assign_to       :post\n"    <<
    "    should_render_template :new\n"     <<
    "    should_respond_with    :success\n" <<
    "  end"
  end
end

Then /^a standard "create" functional test for "posts" should be generated$/ do
  assert_generated_file("test/functional/posts_controller_test.rb") do
    "  context 'POST to create with valid parameters' do\n"        <<
    "    setup do\n"                                               <<
    "      post :create, :post => Factory.attributes_for(:post)\n" <<
    "    end\n\n"                                                  <<
    "    should_set_the_flash_to /created/i\n"                     <<
    "    should_redirect_to('posts index') { posts_path }\n"       <<
    "  end"
  end
end

Then /^a standard "show" functional test for "posts" should be generated$/ do
  assert_generated_file("test/functional/posts_controller_test.rb") do
    "  context 'GET to show for existing post' do\n"         <<
    "    setup do\n"                                         <<
    "      @post = Factory(:post)\n"                         <<
    "      get :show, :id => @post.to_param\n"               <<
    "    end\n\n"                                            <<
    "    should_assign_to       :post, :equals => '@post'\n" <<
    "    should_render_template :show\n"                     <<
    "    should_respond_with    :success\n"                  <<
    "  end"
  end
end

Then /^a standard "edit" functional test for "posts" should be generated$/ do
  assert_generated_file("test/functional/posts_controller_test.rb") do
    "  context 'GET to edit for existing post' do\n"         <<
    "    setup do\n"                                         <<
    "      @post = Factory(:post)\n"                         <<
    "      get :edit, :id => @post.to_param\n"               <<
    "    end\n\n"                                            <<
    "    should_assign_to(:post) { '@post' }\n" <<
    "    should_render_template :edit\n"                     <<
    "    should_respond_with    :success\n"                  <<
    "  end"
  end
end

Then /^a standard "update" functional test for "posts" should be generated$/ do
  assert_generated_file("test/functional/posts_controller_test.rb") do
    "  context 'PUT to update for existing post' do\n"       <<
    "    setup do\n"                                         <<
    "      @post = Factory(:post)\n"                         <<
    "      put :update, :id => @post.to_param,\n"            <<
    "        :post => Factory.attributes_for(:post)\n"       <<
    "    end\n\n"                                            <<
    "    should_set_the_flash_to /updated/i\n"               <<
    "    should_redirect_to('posts index') { posts_path }\n" <<
    "  end"
  end
end

Then /^a standard "destroy" functional test for "posts" should be generated$/ do
  assert_generated_file("test/functional/posts_controller_test.rb") do
    "  context 'given a post' do\n"                              <<
    "    setup { @post = Factory(:post) }\n\n"                   <<
    "    context 'DELETE to destroy' do\n"                       <<
    "      setup { delete :destroy, :id => @post.to_param }\n\n" <<
    "      should_set_the_flash_to /deleted/i\n"                 <<
    "      should_redirect_to('posts index') { posts_path }\n"   <<
    "    end\n"                                                  <<
    "  end"
  end
end

