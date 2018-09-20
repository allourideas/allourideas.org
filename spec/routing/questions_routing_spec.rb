require 'spec_helper'

describe QuestionsController do
  describe "route generation" do
    it "maps #index" do
      expect(:get => "/questions").to route_to(:controller => "questions", :action => "index")
    end

    it "maps #new" do
      expect(:get => "/questions/new").to route_to(:controller => "questions", :action => "new")
    end

    it "maps #show" do
      expect(:get => "/questions/1").to route_to(:controller => "questions", :action => "show", :id => "1")
    end

    it "maps #edit" do
      expect(:get => "/questions/1/edit").to route_to(:controller => "questions", :action => "edit", :id => "1")
    end

    it "maps #create" do
      expect(:post => "/questions").to route_to(:controller => "questions", :action => "create")
    end

    it "maps #update" do
      expect(:put => "/questions/1").to route_to(:controller => "questions", :action => "update", :id => "1")
    end

    it "maps #destroy" do
      expect(:delete => "/questions/1").to route_to(:controller => "questions", :action => "destroy", :id => "1")
    end
  end
end
