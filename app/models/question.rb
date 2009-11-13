class Question < ActiveResource::Base
  self.site = "http://pairwise.heroku.com"
  #self.site = "http://localhost:3001"
  #has_many :items
  
  # def items
  #   item_ids.map {|i| Item.find(i)}
  # end
  attr_accessor :name, :question_text, :question_ideas, :url
  
  def self.find_by_name(name)
    Earl.find(name).question rescue nil
  end
  
  def the_name
    attributes['name']
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
