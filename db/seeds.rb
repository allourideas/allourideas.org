@user = User.find_or_create_by(:email => "chapambrose@gmail.com",
                               :password => "password",
                               :password_confirmation => "password")

photo_ids = (1..32).to_a
@question = Question.create(:name => "Which photo is more Princeton?",
                            :url => "princeton",
                            :local_identifier => @user.id,
                            :visitory_identifier => 123,
                            :ideas => photo_ids.join("\n"))

Earl.create(:question_id => @question.id,
            :name => @question.url,
            :user_id => @user.id,
            :flag_enabled => true)

require "action_controller"
require "action_controller/test_process.rb"
photo_ids.each do |i|
  Photo.create! :image => ActionController::TestUploadedFile.new("#{Rails.root}/db/seed-images/princeton/#{i}.jpg", "image/jpg")
  # Added these in the question.create above
  # Choice.post(:create_from_abroad, :question_id => @question.id, :params => {'auto' => rand(472348), :data => @photo.id, :local_identifier => @user.id})
end
