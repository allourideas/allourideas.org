require 'spec_helper'

describe QuestionsController do

  def mock_question(stubs={})
    @mock_question ||= mock_model(Question, stubs)
  end

  describe "GET admin_stats" do
    context "when not logged in" do
      it "should redirect to the login page" do
        get :admin_stats, :params => {:id => mock_question.id, :format => :json}
        #expect(response).to redirect_to(new_session_url)
        expect(response.status).to eq 401
      end
    end
    context "when logged in as a non-admin" do
      it "should redirect to the login page" do
        sign_in_as create :user
        get :admin_stats, :params => {:id => mock_question.id, :format => :json}
        #response.should redirect_to(new_session_url)
        expect(response.status).to eq 401
      end
    end
    context "when logged in as an admin" do
      it "should return the json response of the stats" do
        sign_in_as create :admin_confirmed_user
        question = double
        allow(question).to receive(:get).and_return({'foo' => 'bar'})
        allow(Question).to receive(:new).and_return(question)
        allow(Question).to receive(:find).with(mock_question.id).and_return(mock_question)
        get :admin_stats, :params => {:id => mock_question.id, :format => :json}
        expect(response.status).to eq 200
      end
    end
  end

  describe "GET index" do
    context "when logged in as an admin" do
      before do
        sign_in_as create :admin_confirmed_user
      end

      it "assigns all questions as @questions" do
        allow(Question).to receive(:find).with(:all).and_return([mock_question])
        get :index, :params => {:format => :xml}
        expect(response.status).to eq 200
        expect(assigns(:questions)).to eq [mock_question]
      end
    end

    context "when not logged in" do
      it "should redirect the user" do
        get :index, :params => {:format => :xml}
        expect(response.status).to eq 401
      end
    end
  end

  describe "GET new" do
    it "assigns a new question as @question" do
      allow(Question).to receive(:new).and_return(mock_question)
      get :new
      expect(assigns(:question)).to eq mock_question
    end
  end

  describe "POST create" do

    describe "with valid params" do
      it "assigns a newly created question as @question" do
        allow(Question).to receive(:new).with({'name' => 'this name'}).and_return(mock_question(:save => true, :valid? => true))
        post :create, :params => {:question => {:name => 'this name'}}
        expect(assigns(:question)).to eq mock_question
      end

      it "redirects to the created question" do
        sign_in_as create :admin_confirmed_user
        allow(Question).to receive(:new).with({"name" => 'this name', "url" => 'urlname'}).and_return(mock_question(:save => true, :valid? => true, :attributes => {}, :fq_earl => '/'))
        post :create, :params => {:question => {:name => 'this name', :url => 'urlname'}}
        expect(response).to redirect_to(earl_url('urlname', :just_created => true))
      end

      it "allows upper case letters" do
        sign_in_as create :admin_confirmed_user
        allow(Question).to receive(:new).with({"name" => 'this name', "url" => 'UrlName'}).and_return(mock_question(:save => true, :valid? => true, :attributes => {}, :fq_earl => '/'))
        post :create, :params => {:question => {:name => 'this name', :url => 'UrlName'}}
        expect(response).to redirect_to(earl_url('UrlName', :just_created => true))
      end

      it "redirects to the created question" do
        sign_in_as create :admin_confirmed_user
        allow(Question).to receive(:new).with({"name" => 'this name', "url" => 'urlname'}).and_return(mock_question(:save => true, :valid? => true, :attributes => {}, :fq_earl => '/'))
        post :create, :params => {:question => {:name => 'this name', :url => 'urlname'}}
        expect(response).to redirect_to(earl_url('urlname', :just_created => true))
      end

      it "redirects to the verify page if suspicious ideas" do
        sign_in_as create :admin_confirmed_user
        allow(Question).to receive(:new).with({"name" => 'this name', "url" => 'newurlname', "ideas" => "http://example.com\nwhat\nnow"}).and_return(mock_question(:save => true, :valid? => true, :attributes => {}, :fq_earl => '/'))
        post :create, :params => {:question => {:name => 'this name', :url => 'newurlname', :ideas => "http://example.com\nwhat\nnow"}}
        expect(response).to redirect_to(verify_url)
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved question as @question" do
        allow(Question).to receive(:new).with({'name' => 'this name'}).and_return(mock_question(:save => false, :valid? => true))
        post :create, :params => {:question => {:name => 'this name'}}
        expect(assigns(:question)).to eq mock_question
      end

      xit "re-renders the 'new' template" do
        allow(Question).to receive(:new).and_return(mock_question(:save => false, :valid? => true))
        post :create, :params => {:question => {}}
        expect(assigns(:question)).to render_template('new')
      end
    end

  end

  describe "PUT update" do
    before do
      @earl = create :earl
      sign_in_as create :admin_confirmed_user
    end

    describe "with valid params" do
      it "assigns the requested question as @question" do
        allow(Question).to receive(:find).and_return(mock_question(:update_attributes => true))
        put :update, :params =>{:id => @earl.slug, :earl => {:foo => 'bar'}}
        expect(assigns(:question)).to eq mock_question
      end

      it "redirects to the question" do
        allow(Question).to receive(:find).and_return(mock_question(:update_attributes => true))
        put :update, :params =>{:id => @earl.slug, :earl => {:foo => 'bar'}}
        expect(response).to redirect_to(earl_url(@earl.name) + "/admin")
      end
    end

  end

end
