namespace :wikipedia do
  
  task(:seed => :environment) do
    User.destroy_all
    Earl.destroy_all
    u = User.create!(:email => 'chapambrose@gmail.com', :password => 'password', :password_confirmation => "password")
    u.email_confirmed = true
    u.save!
    7.times do |i|
      q = Question.new(
        :name => "Please click on the Wikipedia fundraising banner that makes you want to donate more.",
        :url => "wikipedia-#{i+1}",
        :ideas => "Please read: Advertising isn't evil but it doesn't belong on Wikipedia\r\nPlease read: A personal appeal from an author of 549 Wikipedia articles\r\nPlease read: A personal appeal from an author of 159 Wikipedia articles"
      )
      
      q.save
      u.earls.create!(:question_id => q.id, :name => q.url)
    end
  end

end