class Question < ActiveResource::Base
  self.site = API_HOST
  self.user = PAIRWISE_USERNAME
  self.password = PAIRWISE_PASSWORD

  attr_accessor :name, :question_text, :ideas, :url, :information, :email, :password
  
  def self.find_id_by_name(name)
    Earl.find(name).question_id rescue nil
  end
  
  def earl
    "/#{Earl.find_by_question_id(id).name}" rescue nil
  end
  
  def fq_earl
    "http://#{HOST}/#{Earl.find_by_question_id(id).name}" rescue nil
  end
  
  def slug
    Earl.find_by_question_id(id).name
  end
 
  %w(name url the_name ideas).each do |attr|
    define_method attr do
      attributes[attr]
    end
  end 
  
  def active_choices
	self.choices_count - self.inactive_choices_count
  end

  def ideas=(new_ideas)
	  attributes['ideas'] = new_ideas
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

  def testmethod
	  puts "TEST METHOD"
  end
  
  def valid?
    self.validate
    errors.empty?
  end
  
  def validate
    url_format_valid
    url_unique

    errors.add("Name", "is blank (Step 1)") if name.blank?
    errors.add("Ideas", "are blank (Step 3)") if (ideas.blank? || ideas == "Add your own ideas here...\n\nFor example:\nMore hammocks on campus\nImprove student advising\nMore outdoor tables and benches\nVideo game tournaments\nStart late dinner at 8PM\nLower textbook prices\nBring back parking for sophomores")
    return errors
  end
  
  protected
  def url_format_valid
    errors.add("URL", "is blank (Step 2)")  if url.blank?
    errors.add("URL", "contains spaces (Step 2)")  if url.include? ' '
    errors.add("URL", "contains special characters (Step 2)")  if url.include? '+'
    if url.parameterize != url
      errors.add("URL", "contains special characters (Step 2)")  
    end
  end
  
  def url_unique
    begin
      if Earl.find_by_name(attributes['url'].strip).nil?
         Earl.find(attributes['url'].strip)
      end
      errors.add("URL", "has already been taken (Step 2)")
    rescue
      nil
    end
    if Earl.reserved_names.include?(attributes['url'].strip)
      errors.add("URL", "has already been taken (Step 2)")
    end
  end

end
