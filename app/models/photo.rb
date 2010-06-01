class Photo < ActiveRecord::Base
  has_attached_file :image,
                    :styles => 
                      { :large => "600x600>",
                        :medium => "425x340>",
                        :thumb => "50>" 
                      },
                      :path => ":attachment/:id/:style.:extension",
                      :storage => :s3,
                      :s3_credentials => "#{RAILS_ROOT}/config/s3.yml"
end
