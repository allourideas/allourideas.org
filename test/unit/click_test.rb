require 'test_helper'

class ClickTest < ActiveSupport::TestCase
  should_belong_to :session_info
  should_belong_to :user
  
  should "be valid with factory" do
    assert_valid Factory.build(:click)
  end

  should "convert tracking to info when first parameter" do
    click = Click.create(
      :url => 'http://example.com/?tracking=foo&bar=baz',
      :referrer => 'http://example.com/?tracking=foo&bar=baz'
    )
    assert_equal 'http://example.com/?info=foo&bar=baz', click.url
    assert_equal 'http://example.com/?info=foo&bar=baz', click.referrer
  end

  should "convert tracking to info when second parameter" do
    click = Click.create(
      :url => 'http://example.com/?bar=baz&tracking=foo',
      :referrer => 'http://example.com/?bar=baz&tracking=foo'
    )
    assert_equal 'http://example.com/?bar=baz&info=foo', click.url
    assert_equal 'http://example.com/?bar=baz&info=foo', click.referrer
  end

  should "not convert tracking to info when info parameter exists" do
    click = Click.create(
      :url => 'http://example.com/?info=baz&tracking=foo',
      :referrer => 'http://example.com/?info=baz&tracking=foo'
    )
    assert_equal 'http://example.com/?info=baz&tracking=foo', click.url
    assert_equal 'http://example.com/?info=baz&tracking=foo', click.referrer
  end
end
