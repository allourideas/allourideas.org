require 'test/unit'

module Test::Unit::Assertions

  def assert_generated_file(path)
    assert_file_exists(path)
    if block_given?
      File.open(File.join(@rails_root, path)) do |file|
        expected = yield
        body     = file.read
        assert body.include?(expected),
          "expected #{expected} but was #{body}"
      end
    end
  end

  def assert_generated_empty_file(path)
    assert_file_exists(path)
    File.open(File.join(@rails_root, path)) do |file|
      body     = file.read
      assert body.empty?,
        "expected body to be empty but was #{body.inspect}"
    end
  end

  def assert_file_exists(path)
    file = File.join(@rails_root, path)

    assert File.exists?(file), "#{file} expected to exist, but did not"
    assert File.file?(file),   "#{file} expected to be a file, but is not"
  end

  def assert_generated_views_for(name, *actions)
    actions.each do |action|
      assert_generated_file("app/views/#{name}/#{action}.html.erb") do
        yield if block_given?
      end
    end
  end

  def assert_generated_migration(name)
    file = Dir.glob("#{@rails_root}/db/migrate/*_#{name}.rb").first
    file = file.match(/db\/migrate\/[0-9]+_\w+/).to_s << ".rb"
    assert_generated_file(file) { "timestamps" }
    assert_generated_file(file) { yield if block_given? }
  end

  def assert_generated_route_for(name, *actions)
    routeable_actions = actions.collect { |action| ":#{action}" }.join(", ")
    assert_generated_file("config/routes.rb") do
      "  map.resources :#{name.to_s}, :only => [#{routeable_actions}]"
    end
  end

  def assert_has_empty_method(body, *methods)
    methods.each do |name|
      assert body.include?("  def #{name}\n  end"), 
        "should have method #{name} in #{body.inspect}"
      yield(name, $2) if block_given?
    end
  end

end

class BlitzWorld
  include Test::Unit::Assertions
end

World do
  BlitzWorld.new
end

