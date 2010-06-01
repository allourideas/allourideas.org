@user = User.create(:email => 'chapambrose@gmail.com', 
                    :password => 'password', 
                    :password_confirmation => 'password')
                   
@question = Question.create(:name => 'Which photo is more Philly?',
                            :url => 'philly',
                            :local_identifier => @user.id,
                            :visitory_identifier => 123,
                            :ideas => "1 \n 2 \n 3")

Earl.create(:question_id => @question.id,
            :name => @question.url,
            :user_id => @user.id)
                   
                   
require 'action_controller'
require 'action_controller/test_process.rb'
(1..3).to_a.each do |i|
  Photo.create! :image => ActionController::TestUploadedFile.new("#{Rails.root}/db/seed-images/#{i}.jpg", "image/jpeg")
  # Added these in the question.create above
  # Choice.post(:create_from_abroad, :question_id => @question.id, :params => {'auto' => rand(472348), :data => @photo.id, :local_identifier => @user.id})
end