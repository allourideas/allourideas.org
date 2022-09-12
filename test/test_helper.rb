ENV["Rails.env"] = "test"
require File.expand_path(File.dirname(__FILE__) + "/../config/environment")
require "test_help"
require "action_view/test_case"

Mocha::Configuration.warn_when(:stubbing_non_existent_method)
Mocha::Configuration.warn_when(:stubbing_non_public_method)

class ActiveSupport::TestCase
  self.use_transactional_fixtures = true
  self.use_instantiated_fixtures = false
  def self.should_have_attached_file(attachment)
    klass = self.name.gsub(/Test$/, "").constantize

    context "To support a paperclip attachment named #{attachment}, #{klass}" do
      should_have_db_column("#{attachment}_file_name", :type => :string)
      should_have_db_column("#{attachment}_content_type", :type => :string)
      should_have_db_column("#{attachment}_file_size", :type => :integer)
    end

    should "have a paperclip attachment named ##{attachment}" do
      assert klass.new.respond_to?(attachment.to_sym),
             "@#{klass.name.underscore} doesn't have a paperclip field named #{attachment}"
      assert_equal Paperclip::Attachment, klass.new.send(attachment.to_sym).class
    end
  end
end

class ActionView::TestCase
  class TestController < ActionController::Base
    attr_accessor :request, :response, :params

    def initialize
      @request = ActionController::TestRequest.new
      @response = ActionController::TestResponse.new

      # TestCase doesn't have context of a current url so cheat a bit
      @params = {}
      send(:initialize_current_url)
    end
  end
end
