class Item < ActiveResource::Base
  self.site = "http://pairwise.heroku.com"
  
  attr_accessor :name, :question_text, :question_ideas
  
end
