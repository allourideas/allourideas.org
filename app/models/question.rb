class Question < ActiveResource::Base
  self.site = API_HOST
  self.user = PAIRWISE_USERNAME
  self.password = PAIRWISE_PASSWORD

  attr_accessor :name, :question_text, :question_ideas, :url, :information, :email, :password, :it_should_autoactivate_ideas
  
  def self.find_by_name(name, barebones = false)
    Earl.find(name).question(barebones) rescue nil
  end
  
  def self.find_id_by_name(name)
    Earl.find(name).question_id rescue nil
  end
  
  def earl
    "/#{Earl.find_by_question_id(id).name}" rescue nil
  end
  
  def fq_earl
    "#{HOST}/#{Earl.find_by_question_id(id).name}" rescue nil
  end
  
  def slug
    Earl.find_by_question_id(id).name
  end
  
  def name
    attributes['name']
  end
  
  def url
    attributes['url']
  end
  
  def the_name
    attributes['name']
  end
  
  def question_ideas
    attributes['question_ideas']
  end
  
  def creator_id
    c = attributes['local_identifier']
    c = c.first if c.is_a?(Array)
    c.to_i
  end

  def creator
    User.find(creator_id)
  end

  def it_should_autoactivate_ideas
      attributes['it_should_autoactivate_ideas']
  end
  
  def validate_me
    #errors = []
    #raise attributes.inspect
    errors.add("URL", "is blank (Step 2)")  if attributes['url'].blank?
    errors.add("URL", "contains spaces (Step 2)")  if attributes['url'].include? ' '
    errors.add("URL", "contains special characters (Step 2)")  if attributes['url'].include? '@'
    errors.add("URL", "contains special characters (Step 2)")  if attributes['url'].include? '/'
    errors.add("URL", "contains special characters (Step 2)")  if attributes['url'].include? ':'
    errors.add("URL", "contains special characters (Step 2)")  if attributes['url'].include? '|'
    errors.add("URL", "contains special characters (Step 2)")  if attributes['url'].include? '='
    errors.add("URL", "contains special characters (Step 2)")  if attributes['url'].include? '+'
    begin
      Earl.find(attributes['url'].strip)
      errors.add("URL", "has already been taken (Step 2)")
    rescue
      nil
    end
    errors.add("Name", "is blank (Step 1)") if attributes['name'].blank?
    errors.add("Ideas", "are blank (Step 3)") if (attributes['question_ideas'].blank? || attributes['question_ideas'] == "Add your own ideas here...\n\nFor example:\nMore hammocks on campus\nImprove student advising\nMore outdoor tables and benches\nVideo game tournaments\nStart late dinner at 8PM\nLower textbook prices\nBring back parking for sophomores")
    return errors
    # url
    # question
    # ideas
    # email
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
