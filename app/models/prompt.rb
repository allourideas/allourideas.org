class Prompt < ActiveResource::Base
  self.site = "http://pairwise.heroku.com/questions/:question_id/"
  #self.site ="http://localhost:3001/questions/:question_id/"# : "http://pairwise.heroku.com/questions/:question_id/"
  attr_accessor :name, :question_text, :question_ideas

end
