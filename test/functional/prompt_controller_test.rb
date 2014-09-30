require 'test_helper'

class PromptsControllerTest < ActionController::TestCase
  def test_exception_as_json
    get :skip, :question_id => 1, :id => 1, :format => 'js'
    assert_response :error
    assert_equal @response.body[0], '{'
  end

  def test_exception_as_html
    get :skip, :question_id => 1, :id => 1, :format => 'html'
    assert_response :error
    assert_not_equal @response.body[0], '{'
  end
end

