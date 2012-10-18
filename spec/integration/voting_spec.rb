require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')
require 'active_resource/http_mock'

describe 'A User on the vote page' do
  before do
    ActiveResource::HttpMock.respond_to do |mock|
      question = Factory.build(:question, :id => 1, :picked_prompt_id => 1).attributes.to_xml(:root => 'question')
      prompt   = Factory.build(:prompt, :id => 1).attributes.to_xml(:root => 'prompt')
      prompt2  = Factory.build(:prompt, :id => 2).attributes.to_xml(:root => 'prompt')
      mock.get "/questions/1.xml?visitor_identifier=test123&with_appearance=true&with_prompt=true&with_visitor_stats=true", {}, question, 200
      mock.get "/questions/1/prompts/1.xml", {}, prompt, 200
      mock.post "/questions/1/prompts/1/vote.xml?next_prompt%5Bvisitor_identifier%5D=test123&next_prompt%5Bwith_appearance%5D=true&next_prompt%5Bwith_visitor_stats%5D=true&question_id=1&vote%5Bappearance_lookup%5D=f72da54add43e5ca39cab80f1c72f0e7&vote%5Bdirection%5D=left&vote%5Bskip_fraud_protection%5D=true&vote%5Btime_viewed%5D=5&vote%5Btracking%5D%5Bx_click_offset%5D=&vote%5Btracking%5D%5By_click_offset%5D=&vote%5Bvisitor_identifier%5D=test123", {}, prompt2, 200
    end
  end

  it "should be able to vote and get new prompts and see the vote count increment" do
    Capybara.current_driver = Capybara.javascript_driver
    u = Factory.build(:email_confirmed_user)
    e = Factory.create(:earl, :user => u)

    visit earl_path(e.name)
    page.should have_content("Cast Votes")
    # save for later tests
    number_of_votes = find('#votes_count').text.to_i
    idea_text = find('.leftside').text
    # vote
    find('.leftside').click
    # ensure voted option is now disabled
    page.should have_css('.leftside.disabled')
    # wait until voted option is no longer exists
    page.should have_no_css('.leftside.disabled')
    # number of votes should have been incremented
    (number_of_votes + 1).should eql find('#votes_count').text.to_i
    # verify that we've loaded new ideas
    idea_text.should_not eql find('.leftside').text
  end
end
