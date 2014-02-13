require 'test_helper'

class SurveySessionTest < ActiveSupport::TestCase
  # create verifiable cookie value
  def c(value)
    verifier = ActiveSupport::MessageVerifier.new(APP_CONFIG[:SURVEY_SESSION_SECRET])
    verifier.generate(value)
  end

  def exception_test(test)
    exception = assert_raises(CantFindSessionFromCookies, "ARGS: #{test[:args].inspect}") { SurveySession.send(:find, *test[:args]) }
    assert_equal(test[:message], exception.message, "ARGS: #{test[:args].inspect}")
  end

  context "the find method" do

    should "raise an exception when no cookies are sent" do
      exception_test({:message => 'No possible keys available', :args => [{}, 1]})
    end

    should "raise an exception when no cookie names match the question_id" do
      exception_test({:message => 'No possible keys available', :args => [{'aoi_2_abc' => ''}, 1]})
    end

    should "raise an exception when the only possible key does not have a valid appearance lookup" do
      exception_test({:message => 'Only possible key did not have valid appearance lookup', :args => [{'aoi_1_abc' => c({:question_id => 1})}, 1, 'lookup']})
    end

    should "raise an exception when the question id value does not match cookie name" do
      exception_test({:message => 'Question ID did not match cookie name', :args => [{'aoi_1_abc' => c({:question_id => 2})}, 1]})
    end

    should "raise an exception when the data is nil" do
      exception_test({:message => 'Data is not hash', :args => [{'aoi_1_abc' => c(nil)}, 1, 'lookup']})
    end

    should "raise an exception when the data is an empty string" do
      exception_test({:message => 'Data is not hash', :args => [{'aoi_1_abc' => c('')}, 1, 'lookup']})
    end

    should "raise an exception when cookie failed validation with no lookup" do
      exception_test({:message => 'Possible key failed verification', :args => [{"aoi_1_abc" => {}}, 1]})
    end

    should "raise an exception when cookie failed validation with a lookup" do
      exception_test({:message => 'Possible key failed verification', :args => [{'aoi_1_abc' => {}}, 1, 'lookup']})
    end

    should "raise an exception when all possible keys failed verification" do
      exception_test({:message => 'All possible keys failed verification', :args => [{"aoi_1_abc" => {}, "aoi_1_def" => {}}, 1]})
    end

    should "raise an exception when multiple possible cookies found but are invalid" do
      exception_test({:message => 'No key found valid with appearance_lookup', :args => [{"aoi_1_abc" => {}, "aoi_1_def" => {}}, 1, 'lookup']})
    end

    should "raise an exception when the possible cookies don't have the proper lookup" do
      exception_test({:message => 'No key found valid with appearance_lookup', :args => [{"aoi_1_abc" => c({:question_id => 1}), "aoi_1_def" => {}}, 1, 'lookup']})
    end

    should "raise an exception when multiple possible cookies exist, but have nil data" do
      exception_test({:message => 'Data is not hash', :args => [{"aoi_1_abc" => c(nil), "aoi_1_def" => ''}, 1, 'lookup']})
    end

    should "raise an exception when the question id does not match cookie and a lookup is sent" do
      exception_test({:message => 'Question ID did not match cookie name', :args => [{'aoi_1_abc' => c({:question_id => 2, :appearance_lookup => 'lookup'})}, 1, 'lookup']})
    end
  end

  should "return the session data when found" do
    match_session = {
      :session => 'match',
      :question_id => 1,
      :appearance_lookup => 'lookup'
    }
    match_2_session = {
      :session => 'match',
      :question_id => 2,
      :appearance_lookup => 'lookup'
    }
    no_match_session = {
      :session => 'match',
      :question_id => 1,
      :appearance_lookup => 'no_lookup'
    }
    test_matrix = [
      {:args => [{'aoi_1_abc' => c(match_session)}, 1], :result => match_session},
      {:args => [{'aoi_1_abc' => c(match_session), 'aoi_1_def' => c(no_match_session)}, 1], :result => match_session},
      {:args => [{'aoi_1_abc' => c(match_session), 'aoi_2_aaa' => c(no_match_session)}, 1], :result => match_session},
      {:args => [{'aoi_1_abc' => c(no_match_session), 'aoi_2_aaa' => c(match_2_session)}, 2], :result => match_2_session},
      {:args => [{'aoi_1_lookup' => c(match_session), 'aoi_1_aaa' => c(no_match_session)}, 1, 'lookup'], :result => match_session},
      {:args => [{'aoi_1_lookup' => c(match_session)}, 1, 'lookup'], :result => match_session},
    ]
    test_matrix.each do |test|
      assert_equal(SurveySession.send(:find, *test[:args]), test[:result], "ARGS: #{test[:args].inspect}")
    end
  end
end
