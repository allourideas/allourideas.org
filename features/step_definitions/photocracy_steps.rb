Given /^I am in photocracy mode$/ do
    @photocracy_mode = true
    
    #The following is normally done in application_controller to set
    #  the proper api credentials for photocracy. We are duplicating here
    #  only so we can use things like Question.create to set up test conditions
    puts "Changing api credentials to photocracy"
    active_resource_classes = [Choice, Density, Prompt, Question, Session]
    active_resource_classes.each do |klass|
      klass.user = PHOTOCRACY_USERNAME
      klass.password = PHOTOCRACY_PASSWORD
    end

    # This makes the appropriate css and javascript entries available to capybara's 'show me the page' helper step
end

