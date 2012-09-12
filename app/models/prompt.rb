class Prompt < ActiveResource::Base
  self.site = "#{APP_CONFIG[:API_HOST]}/questions/:question_id/"
  self.user = APP_CONFIG[:PAIRWISE_USERNAME]
  self.password = APP_CONFIG[:PAIRWISE_PASSWORD]
  
  attr_accessor :name, :question_text, :question_ideas

end
