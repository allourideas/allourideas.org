class Photo < ActiveRecord::Base
  paperclip_options = {:styles => 
                         { :large => "600x600>",
                           :medium => "425x340>",
                           :thumb => "x50" 
                         }
                      }
  unless ["cucumber", "development"].include?(Rails.env)
    paperclip_options.merge!({ :path => ":attachment/:id/:style.:extension",
                               :storage => :s3,
                               :s3_credentials => "#{RAILS_ROOT}/config/s3.yml"
			      })
  end

  has_attached_file :image, paperclip_options
end
