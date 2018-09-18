class Photo < ActiveRecord::Base
  paperclip_options = {:styles => 
                         { :large => "600x600>",
                           :medium => "425x340>",
                           :thumb => "x50" 
                         },
			:processors => [:rotator]
                      }
  unless ["cucumber", "development"].include?(Rails.env)
    paperclip_options.merge!({ :path => ":attachment/:id/:style.:extension",
                               :storage => :s3,
                               :s3_credentials => "#{Rails.root}/config/s3.yml"
			      })
  end

  has_attached_file :image, paperclip_options
  #validates_attachment_content_type :image, :content_type => ['image/jpeg', "image/png", "image/gif"], :message => "Not a supported image type (jpg, png, gif only)"
  validates_attachment_size :image, :less_than => 5.megabytes, :message => "size needs to be less than 5 megabytes"

  attr_accessor :rotation_degrees, :rotate

  def rotate!(degrees = 90)
    self.rotation += degrees
    self.rotation -= 360 if self.rotation >= 360
    self.rotation += 360 if self.rotation <= -360
    
    self.rotate = true
    self.image.reprocess!
    self.save
  end
  
  def rotating?
    !self.rotation.nil? and self.rotate
  end

  # return original_file_name if available, otherwise name from paperclip
  def photo_name
    (original_file_name.blank?) ? self.image.original_filename : original_file_name
  end

end
