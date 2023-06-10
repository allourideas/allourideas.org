# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = "1.0"

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
require "active_storage/service/s3_service"
ActiveStorage::Service::S3Service.class_eval do
  def object_for(key)
    bucket.object("#{key}.png")
  end
end