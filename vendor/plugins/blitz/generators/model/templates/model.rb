class <%= class_name %> < ActiveRecord::Base
<% attributes.select(&:reference?).each do |each| -%>
  belongs_to :<%= each.name %>
<% end -%>
<% attributes.select { |each| each.type == :paperclip }.each do |each| -%>
  has_attached_file :<%= each.name %>,
   :path           => ":attachment/:id/:style.:extension",
   :storage        => :s3,
   :s3_credentials => {
     :access_key_id     => ENV['S3_KEY'],
     :secret_access_key => ENV['S3_SECRET']
   },
   :bucket         => ENV['S3_BUCKET']
<% end -%>
end
