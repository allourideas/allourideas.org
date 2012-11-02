require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe QuestionsController do

  def mock_question(stubs={})
    @mock_question ||= mock_model(Question, stubs)
  end

  describe "GET index" do
    context "when logged in as an admin" do
      before do
        sign_in_as Factory.create :admin_confirmed_user
      end

      it "assigns all questions as @questions" do
        Question.stub!(:find).with(:all).and_return([mock_question])
        get :index
        response.should be_success
        assigns[:questions].should == [mock_question]
      end
    end

    context "when not logged in" do
      it "should redirect the user" do
        get :index
        response.should be_redirect
      end
    end
  end

  describe "GET new" do
    it "assigns a new question as @question" do
      Question.stub!(:new).and_return(mock_question)
      get :new
      assigns[:question].should equal(mock_question)
    end
  end

  describe "POST create" do

    describe "with valid params" do
      it "assigns a newly created question as @question" do
        Question.stub!(:new).with({'name' => 'this name'}).and_return(mock_question(:save => true, :valid? => true))
        post :create, :question => {:name => 'this name'}
        assigns[:question].should equal(mock_question)
      end

      it "redirects to the created question" do
        sign_in_as Factory.create :admin_confirmed_user
        Question.stub!(:new).with({"name" => 'this name', "url" => 'urlname'}).and_return(mock_question(:save => true, :valid? => true, :attributes => {}, :fq_earl => '/'))
        post :create, :question => {:name => 'this name', :url => 'urlname'}
        response.should redirect_to(earl_url('urlname', :just_created => true))
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved question as @question" do
        Question.stub!(:new).with({'name' => 'this name'}).and_return(mock_question(:save => false, :valid? => true))
        post :create, :question => {:name => 'this name'}
        assigns[:question].should equal(mock_question)
      end

      it "re-renders the 'new' template" do
        Question.stub!(:new).and_return(mock_question(:save => false, :valid? => true))
        post :create, :question => {}
        response.should render_template('new')
      end
    end

  end

  describe "PUT update" do
    before do
      @earl = Factory.create :earl
      sign_in_as Factory.create :admin_confirmed_user
    end

    describe "with valid params" do
      it "assigns the requested question as @question" do
        Question.stub!(:find).and_return(mock_question(:update_attributes => true))
        put :update, :id => @earl.name, :earl => {}
        assigns[:question].should equal(mock_question)
      end

      it "redirects to the question" do
        Question.stub!(:find).and_return(mock_question(:update_attributes => true))
        put :update, :id => @earl.name, :earl => {}
        response.should redirect_to(earl_url(@earl.name) + "/admin")
      end
    end


  end

end
