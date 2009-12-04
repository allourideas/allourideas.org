class Question < ActiveResource::Base
  self.site = API_HOST
  self.user = PAIRWISE_USERNAME
  self.password = PAIRWISE_PASSWORD

  attr_accessor :name, :question_text, :question_ideas, :url, :information, :email, :password
  
  def self.find_by_name(name)
    Earl.find(name).question rescue nil
  end
  
  def earl
    "/#{Earl.find_by_question_id(id).name}" rescue nil
  end
  
  def slug
    Earl.find_by_question_id(id).name
  end
  
  def the_name
    attributes['name']
  end
  
  def creator_id
    c = attributes['local_identifier']
    c = c.first if c.is_a?(Array)
    c.to_i
  end

  def creator
    User.find(creator_id)
  end
  
  
  # 
  # def items_url
  #   Item.collection_path(:question_id => self.id)
  # end
  # 
  # def items
  #     item_ids = Item.find(:all, :select => "user_id")
  #     users = user_ids.collect { |projects_users| User.find(projects_users.user_id) }
  # end
end
