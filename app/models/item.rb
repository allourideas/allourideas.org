class Item < ActiveResource::Base
  belongs_to :question
  self.site = "http://pairwise.heroku.com"
  
  attr_accessor :name, :question_text, :question_ideas
  
end
