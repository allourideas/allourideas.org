require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require 'active_resource/http_mock'

describe EarlsController do

  def mock_question(stubs={})
    @mock_question ||= mock_model(Question, stubs)
  end

  describe "GET :show" do
    before do
      ActiveResource::HttpMock.respond_to do |mock|
        question = Factory.build(:question, :id => 1, :picked_prompt_id => 1).attributes.to_xml(:root => 'question')
        prompt   = Factory.build(:prompt, :id => 1).attributes.to_xml(:root => 'prompt')
        prompt2  = Factory.build(:prompt, :id => 2).attributes.to_xml(:root => 'prompt')
        mock.get "/questions/1.xml?visitor_identifier=test123&with_appearance=true&with_prompt=true&with_visitor_stats=true", {}, question, 200
        mock.get "/questions/1.xml?visitor_identifier=test123&with_appearance=true&with_average_votes=true&with_prompt=true&with_visitor_stats=true", {}, question, 200
        mock.get "/questions/1/prompts/1.xml", {}, prompt, 200
        mock.post "/questions/1/prompts/1/vote.xml?next_prompt%5Bvisitor_identifier%5D=test123&next_prompt%5Bwith_appearance%5D=true&next_prompt%5Bwith_visitor_stats%5D=true&question_id=1&vote%5Bappearance_lookup%5D=f72da54add43e5ca39cab80f1c72f0e7&vote%5Bdirection%5D=left&vote%5Bskip_fraud_protection%5D=true&vote%5Btime_viewed%5D=5&vote%5Btracking%5D%5Bx_click_offset%5D=&vote%5Btracking%5D%5By_click_offset%5D=&vote%5Bvisitor_identifier%5D=test123", {}, prompt2, 200
      end
      @earl = Factory.create(:earl)
    end

    it "assigns question_id and earl" do
      get(:show, {:id => @earl.name}, {:session_id => nil})
      assigns[:earl].should == @earl
      assigns[:question_id].should == @earl.question_id
    end

    it "sets a survey session cookie with a new cookie" do
      get(:show, {:id => @earl.name}, {:session_id => nil})
      assigns[:earl].should == @earl
      assigns[:question_id].should == @earl.question_id
      assigns[:survey_session].cookie_value.should == @controller.send(:cookies)[assigns[:survey_session].cookie_name]
    end

    it "assigns a new session if the session has been tampered" do
      cookiename = "aoi_#{@earl.question_id}_1234"
      new_sess = SurveySession.new({:question_id => @earl.question_id}, cookiename)
      @request.cookies[new_sess.cookie_name] = new_sess.cookie_value + 'TAMPER'
      get(:show, {:id => @earl.name}, {:session_id => nil})
      assigns[:earl].should == @earl
      assigns[:question_id].should == @earl.question_id
      assigns[:survey_session].cookie_name.should_not == cookiename
      assigns[:survey_session].cookie_value.should_not == @controller.send(:cookies)[cookiename]
      assigns[:survey_session].cookie_value.should == @controller.send(:cookies)[assigns[:survey_session].cookie_name]
    end

    it "sets a survey session cookie with the right data when passed a cookie" do
      cookiename = "aoi_#{@earl.question_id}_1234"
      new_sess = SurveySession.new({:question_id => @earl.question_id}, cookiename)
      @request.cookies[new_sess.cookie_name] = new_sess.cookie_value
      get(:show, {:id => @earl.name}, {:session_id => nil})
      assigns[:earl].should == @earl
      assigns[:question_id].should == @earl.question_id
      assigns[:survey_session].cookie_name.should == cookiename
      assigns[:survey_session].cookie_value.should == @controller.send(:cookies)[cookiename]
    end

  end

end
