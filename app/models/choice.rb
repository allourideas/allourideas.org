class Choice < ActiveResource::Base
  self.site = "#{APP_CONFIG[:API_HOST]}/questions/:question_id/"

  attr_accessor :name, :question_text, :question_ideas

  def question_id
    prefix_options[:question_id]
  end
  
  def data
    attributes['data']
  end

  def created_at
    attributes['created_at']
  end
  
  def activate!
    puts "about to activate choice, #{self.inspect}"
    self.active = true
    puts "about to save"
    self.save
    puts "saved"
  end
  
  def active?
    attributes['active']
  end

  def score
	  attributes['score']
  end

  def user_created
	  attributes['user_created']
  end
end
