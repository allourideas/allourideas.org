module AllOurIdeas
  class Question
    include SAXMachine
    elements :idea, :as => :ideas#, :class => Idea
    element :name, :value => :name
    
    def parse_sample_ideas
      q = AllOurIdeas::Question.parse(File.open(RAILS_ROOT+'/ideas.xml'))
    end
    
    def add_sample_ideas_to(i)
      @question = ::Question.find(i)
      
      voter = User.first
      parse_sample_ideas.each { |idea| 
        item = voter.items.create({:data => idea, :creator => voter})
        choice = @question.choices.create(:item => item)
        }
    end
  end
  
  
end