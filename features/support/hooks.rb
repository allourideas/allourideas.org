Before("@photocracy") do
  @photocracy_mode = true
  puts "Changing api credentials to photocracy"
  set_active_resource_credentials
end

After("@photocracy") do
  @photocracy_mode = false

  #The following is normally done in application_controller to set
  #  the proper api credentials for photocracy. We are duplicating here
  #  only so we can use things like Question.create to set up test conditions
  puts "Changing api credentials back to AOI"
  set_active_resource_credentials
end

#The following is normally done in application_controller to set
#  the proper api credentials for photocracy. We are duplicating here
#  only so we can use things like Question.create to set up test conditions
def set_active_resource_credentials
  puts "Changing credentials to something"
  if @photocracy_mode
    $PHOTOCRACY = true
    username = ENV["PHOTOCRACY_USERNAME"]
    password = ENV["PHOTOCRACY_PASSWORD"]
  else
    $PHOTOCRACY = false
    username = ENV["PAIRWISE_USERNAME"]
    password = ENV["PAIRWISE_PASSWORD"]
  end
  active_resource_classes = [Choice, Density, Prompt, Question, Session]
  active_resource_classes.each do |klass|
    klass.user = username
    klass.password = password
  end
end
