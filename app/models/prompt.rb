class Prompt < ActiveResource::Base
  self.site = "#{ENV["API_HOST"]}/questions/:question_id/"
  self.user = ENV["PAIRWISE_USERNAME"]
  self.password = ENV["PAIRWISE_PASSWORD"]

  attr_accessor :name, :question_text, :question_ideas
end
