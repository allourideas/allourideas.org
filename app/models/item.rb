class Item < ActiveResource::Base
  self.site = "#{APP_CONFIG[:API_HOST]}/questions/:question_id/"
  attr_accessor :name, :question_text, :question_ideas
  
  def question_id
    prefix_options[:question_id]
  end
  
  def path
    "/questions/#{question_id}/choices/#{id}"
  end
end
