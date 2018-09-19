require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require 'active_resource/http_mock'

describe PromptsController do

  def mock_question(stubs={})
    @mock_question ||= mock_model(Question, stubs)
  end

  before do
    @appearance_lookup = 'f72da54add43e5ca39cab80f1c72f0e7'
    ActiveResource::HttpMock.respond_to do |mock|
      question = build(:question, :id => 1, :picked_prompt_id => 1).attributes.to_xml(:root => 'question')
      prompt   = build(:prompt, :id => 1).attributes.to_xml(:root => 'prompt')
      prompt2  = build(:prompt, :id => 2).attributes.to_xml(:root => 'prompt')
      choice   = build(:choice, :id => 2).attributes.to_xml(:root => 'choice')
      mock.get "/questions/1.xml?visitor_identifier=test123&with_appearance=true&with_prompt=true&with_visitor_stats=true", {}, question, 200
      mock.get "/questions/1.xml?visitor_identifier=test123&with_appearance=true&with_average_votes=true&with_prompt=true&with_visitor_stats=true", {}, question, 200
      mock.get "/questions/1/prompts/1.xml", {}, prompt, 200
      mock.put "/questions/1/prompts/1/vote.xml?next_prompt%5Bvisitor_identifier%5D=test123&next_prompt%5Bwith_appearance%5D=true&next_prompt%5Bwith_visitor_stats%5D=true&question_id=1&vote%5Bappearance_lookup%5D=#{@appearance_lookup}&vote%5Bdirection%5D=left&vote%5Bskip_fraud_protection%5D=true&vote%5Btime_viewed%5D=5&vote%5Btracking%5D%5Bx_click_offset%5D=&vote%5Btracking%5D%5By_click_offset%5D=&vote%5Bvisitor_identifier%5D=test123", {}, prompt2, 200
      mock.put "/questions/1/prompts/1/vote.xml?next_prompt%5Bvisitor_identifier%5D=test123&next_prompt%5Bwith_appearance%5D=true&next_prompt%5Bwith_visitor_stats%5D=true&question_id=1&vote%5Bappearance_lookup%5D=#{@appearance_lookup}&vote%5Bdirection%5D=left&vote%5Bold_visitor_identifier%5D=expired_session_id&vote%5Bskip_fraud_protection%5D=true&vote%5Btime_viewed%5D=5&vote%5Btracking%5D%5Bx_click_offset%5D=&vote%5Btracking%5D%5By_click_offset%5D=&vote%5Bvisitor_identifier%5D=test123", {}, prompt2, 200
      mock.post "/questions/1/prompts/1/skip.xml?next_prompt%5Bvisitor_identifier%5D=test123&next_prompt%5Bwith_appearance%5D=true&next_prompt%5Bwith_visitor_stats%5D=true&question_id=1&skip%5Bappearance_lookup%5D=#{@appearance_lookup}&skip%5Bskip_reason%5D=&skip%5Btime_viewed%5D=5&skip%5Bvisitor_identifier%5D=test123", {}, prompt2, 200
      mock.post "/questions/1/prompts/1/skip.xml?next_prompt%5Bvisitor_identifier%5D=test123&next_prompt%5Bwith_appearance%5D=true&next_prompt%5Bwith_visitor_stats%5D=true&question_id=1&skip%5Bappearance_lookup%5D=#{@appearance_lookup}&skip%5Bold_visitor_identifier%5D=expired_session_id&skip%5Bskip_reason%5D=&skip%5Btime_viewed%5D=5&skip%5Bvisitor_identifier%5D=test123", {}, prompt2, 200
      mock.post "/questions/1/prompts/1/skip.xml?next_prompt%5Bvisitor_identifier%5D=test123&next_prompt%5Bwith_appearance%5D=true&next_prompt%5Bwith_visitor_stats%5D=true&question_id=1&skip%5Bappearance_lookup%5D=#{@appearance_lookup}&skip%5Bold_visitor_identifier%5D=expired_flag_session_id&skip%5Bskip_reason%5D=&skip%5Btime_viewed%5D=5&skip%5Bvisitor_identifier%5D=test123", {}, prompt2, 200
      mock.put "/questions/1/choices/2/flag.xml?explanation=&visitor_identifier=test123", {}, choice, 200
      mock.put "/questions/1/choices/7/flag.xml?explanation=&visitor_identifier=test123", {}, choice, 200
    end
    @earl = create(:earl)
  end

  describe "POST :vote" do

    it "assigns question_id and earl" do
      cookiename = "aoi_#{@earl.question_id}_1234"
      new_sess = SurveySession.new({:question_id => @earl.question_id, :appearance_lookup => @appearance_lookup}, cookiename)
      @request.cookies[new_sess.cookie_name] = new_sess.cookie_value
      post(:vote, :params => {:question_id => @earl.question_id, :id => 1, :direction => 'left', :appearance_lookup => @appearance_lookup})
      expect(assigns(:earl)).to eq @earl
      expect(assigns(:question_id).to_i).to eq @earl.question_id
    end

    it "sends old_visitor_identifier to pairwise after an expired session" do
      cookiename = "aoi_#{@earl.question_id}_1234"
      new_sess = SurveySession.new({:question_id => @earl.question_id, :appearance_lookup => @appearance_lookup, :expiration_time => 1.year.ago.utc, :session_id => 'expired_session_id'}, cookiename)
      @request.cookies[new_sess.cookie_name] = new_sess.cookie_value
      post(:vote, :params =>  {:question_id => @earl.question_id, :id => 1, :direction => 'left', :appearance_lookup => @appearance_lookup})
    end

    it "raises an error when no appearance_lookup set in session" do
      cookiename = "aoi_#{@earl.question_id}_1234"
      new_sess = SurveySession.new({:question_id => @earl.question_id}, cookiename)
      @request.cookies[new_sess.cookie_name] = new_sess.cookie_value
      expect do
        post(:vote, :params => {:question_id => @earl.question_id, :id => 1, :direction => 'left', :appearance_lookup => @appearance_lookup})
      end.to raise_error
    end

    it "raises an error when no cookie sent" do
      expect do
        post(:vote, :params => {:question_id => @earl.question_id, :id => 1, :direction => 'left', :appearance_lookup => @appearance_lookup})
      end.to raise_error
    end

  end

  describe "POST :skip" do

    it "assigns question_id and earl" do
      cookiename = "aoi_#{@earl.question_id}_1234"
      new_sess = SurveySession.new({:question_id => @earl.question_id, :appearance_lookup => @appearance_lookup}, cookiename)
      @request.cookies[new_sess.cookie_name] = new_sess.cookie_value
      post(:skip,  :params => {:question_id => @earl.question_id, :id => 1, :direction => 'left', :appearance_lookup => @appearance_lookup})
      expect(assigns(:earl)).to eq @earl
      expect(assigns(:question_id).to_i).to eq @earl.question_id
    end

    it "sends old_visitor_identifier to pairwise after an expired session" do
      cookiename = "aoi_#{@earl.question_id}_1234"
      new_sess = SurveySession.new({:question_id => @earl.question_id, :appearance_lookup => @appearance_lookup, :expiration_time => 1.year.ago.utc, :session_id => 'expired_session_id'}, cookiename)
      @request.cookies[new_sess.cookie_name] = new_sess.cookie_value
      post(:skip, :params => {:question_id => @earl.question_id, :id => 1, :direction => 'left', :appearance_lookup => @appearance_lookup})
    end

    it "raises an error when no appearance_lookup set in session" do
      cookiename = "aoi_#{@earl.question_id}_1234"
      new_sess = SurveySession.new({:question_id => @earl.question_id}, cookiename)
      @request.cookies[new_sess.cookie_name] = new_sess.cookie_value
      expect do
        post(:skip, :params => {:question_id => @earl.question_id, :id => 1, :direction => 'left', :appearance_lookup => @appearance_lookup})
      end.to raise_error
    end

    it "raises an error when no cookie sent" do
      expect do
        post(:skip, :params => {:question_id => @earl.question_id, :id => 1, :direction => 'left', :appearance_lookup => @appearance_lookup})
      end.to raise_error
    end
  end

  describe "POST :flag" do

    it "assigns question_id and earl" do
      cookiename = "aoi_#{@earl.question_id}_1234"
      new_sess = SurveySession.new({:question_id => @earl.question_id, :appearance_lookup => @appearance_lookup}, cookiename)
      @request.cookies[new_sess.cookie_name] = new_sess.cookie_value
      post(:flag, :params => {:question_id => @earl.question_id, :id => 1, :direction => 'left', :appearance_lookup => @appearance_lookup})
      expect(assigns(:earl)).to eq @earl
      expect(assigns(:question_id).to_i).to eq @earl.question_id
    end

    it "sends old_visitor_identifier to pairwise after an expired session" do
      cookiename = "aoi_#{@earl.question_id}_1234"
      new_sess = SurveySession.new({:question_id => @earl.question_id, :appearance_lookup => @appearance_lookup, :expiration_time => 1.year.ago.utc, :session_id => 'expired_flag_session_id'}, cookiename)
      @request.cookies[new_sess.cookie_name] = new_sess.cookie_value
      post(:flag, :params => {:question_id => @earl.question_id, :id => 1, :direction => 'left', :appearance_lookup => @appearance_lookup})
    end


    it "raises an error when no appearance_lookup set in session" do
      cookiename = "aoi_#{@earl.question_id}_1234"
      new_sess = SurveySession.new({:question_id => @earl.question_id}, cookiename)
      @request.cookies[new_sess.cookie_name] = new_sess.cookie_value
      expect do
        post(:flag, :params => {:question_id => @earl.question_id, :id => 1, :direction => 'left', :appearance_lookup => @appearance_lookup})
      end.to raise_error
    end

    it "raises an error when no cookie sent" do
      expect do
        post(:flag, :params => {:question_id => @earl.question_id, :id => 1, :direction => 'left', :appearance_lookup => @appearance_lookup})
      end.to raise_error
    end
  end

end
