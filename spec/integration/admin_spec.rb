require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require 'active_resource/http_mock'

describe 'An super-admin on the admin page' do
  before do
    ActiveResource::HttpMock.respond_to do |mock|
      question = Factory.build(:question, :id => 1, :picked_prompt_id => 1).attributes
      questions = [question].to_xml(:root => 'questions')
      mock.get "/questions.xml?active_user_ideas=true&all=false&user_ideas=true&votes_since=2012-11-02", {}, questions, 200
      mock.get "/questions/1.xml", {}, question.to_xml(:root => 'question'), 200
      mock.get "/questions/1/vote_rate.xml", {}, {:voterate => 0.5}.to_xml, 200
      mock.get "/questions/1/upload_to_participation_rate.xml", {}, {:uploadparticipationrate => 0.2}.to_xml, 200
      mock.get "/questions/1/median_responses_per_session.xml", {}, {:median => 3}.to_xml, 200
      mock.get "/questions/1/votes_per_uploaded_choice.xml", {}, {:value => 3.33333}.to_xml, 200
    end
  end

  it "should see the stats get filled in via ajax" do
    Capybara.current_driver = Capybara.javascript_driver
    admin = Factory.create(:admin_confirmed_user)
    capybara_sign_in_as(admin)

    u = Factory.build(:email_confirmed_user)
    e = Factory.create(:earl, :user => u)

    visit admin_path
    page.should have_content("Data Visualizations")
    page.should have_no_selector('[data-stats-key] img')
    page.find('[data-stats-key="vote_rate"]').text.should == "0.5"
    page.find('[data-stats-key="upload_to_participation_rate"]').text.should == "0.2"
    page.find('[data-stats-key="median_responses_per_session"]').text.should == "3"
    page.find('[data-stats-key="votes_per_uploaded_choice"]').text.should == "3.333"
  end
end
