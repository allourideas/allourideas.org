class Choice < ActiveResource::Base
  # case RAILS_ENV
  # when 'staging'
  #   self.site = "#{STAGING_API_HOST}/questions/:question_id/"
  # when 'production'
  #   self.site = "#{PRODUCTION_API_HOST}/questions/:question_id/"
  # else
    self.site = "#{API_HOST}/questions/:question_id/"
  #end
  
  self.user = PAIRWISE_USERNAME
  self.password = PAIRWISE_PASSWORD
  
  attr_accessor :name, :question_text, :question_ideas

  def question_id
    prefix_options[:question_id]
  end
  
  def path
    #puts "inside Choice#path"
    @earl = Earl.find_by_question_id(self.question_id)
    "/#{@earl.name}/choices/#{id}"
  end
  
  def data
    attributes['data']
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
