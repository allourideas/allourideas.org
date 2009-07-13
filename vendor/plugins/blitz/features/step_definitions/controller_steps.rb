When /^I generate a "(.*)" controller with "(.*)" action$/ do |controller, action|
  system "cd #{@rails_root} && " <<
         "script/generate controller #{controller} #{action} && " <<
         "cd .."
end

Then /^a "new" controller action for "posts" should be generated$/ do
  assert_generated_file("app/controllers/posts_controller.rb") do
    "  def new\n"            <<
    "    @post = Post.new\n" <<
    "  end"
  end
end

Then /^a "create" controller action for "posts" should be generated$/ do
  assert_generated_file("app/controllers/posts_controller.rb") do
    "  def create\n"                          <<
    "    @post = Post.new(params[:post])\n"   <<
    "    @post.save\n"                        <<
    "    flash[:success] = 'Post created.'\n" <<
    "    redirect_to posts_path\n"            <<
    "  end"
  end
end

Then /^a "show" controller action for "posts" should be generated$/ do
  assert_generated_file("app/controllers/posts_controller.rb") do
    "  def show\n"                         <<
    "    @post = Post.find(params[:id])\n" <<
    "  end"
  end
end

Then /^a "edit" controller action for "posts" should be generated$/ do
  assert_generated_file("app/controllers/posts_controller.rb") do
    "  def edit\n"                         <<
    "    @post = Post.find(params[:id])\n" <<
    "  end"
  end
end

Then /^a "update" controller action for "posts" should be generated$/ do
  assert_generated_file("app/controllers/posts_controller.rb") do
    "  def update\n"                               <<
    "    @post = Post.find(params[:id])\n"         <<
    "    @post.update_attributes(params[:post])\n" <<
    "    flash[:success] = 'Post updated.'\n"      <<
    "    redirect_to posts_path\n"                 <<
    "  end"
  end
end

Then /^a "destroy" controller action for "posts" should be generated$/ do
  assert_generated_file("app/controllers/posts_controller.rb") do
    "  def destroy\n"                         <<
    "    @post = Post.find(params[:id])\n"    <<
    "    @post.destroy\n"                     <<
    "    flash[:success] = 'Post deleted.'\n" <<
    "    redirect_to posts_path\n"            <<
    "  end"
  end
end

Then /^only a "([^\"]*)" action for RESTful "([^\"]*)" route should be generated$/ do |action, resource|
  assert_generated_route_for resource, action
end

