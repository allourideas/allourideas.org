class Item < ActiveResource::Base
  self.site = "http://pairwise.heroku.com/questions/:question_id/"
  attr_accessor :name, :question_text, :question_ideas
  
end
