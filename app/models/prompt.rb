class Prompt < ActiveResource::Base
  self.site = "#{APP_CONFIG[:API_HOST]}/questions/:question_id/"

  attr_accessor :name, :question_text, :question_ideas

end
