class StaticController < ApplicationController
  def index
    earlName = params[:earlName]

    # If path is empty or root, render home#index
    if earlName.blank?
      render 'home#index'
    else
      # Load the Earl model
      @earl = Earl.select(:id, :configuration, :welcome_message).find_by_name(earlName)
      if @earl.nil?
        render 'home#index'
      else
        file_path = Rails.root.join('public', 'apps', 'aoi_survey', 'dist', 'index.html')
        html = File.read(file_path)

        html.gsub!('OG_REPLACE_QUESTION_NAME', @earl.question_name || '')
        html.gsub!('OG_REPLACE_DESCRIPTION', @earl.welcome_message || '')
        html.gsub!('HTTPS://OG_REPLACE_IMAGE_URL', @earl.logo_url || '')
        url = URI.parse(request.original_url)
        url.query = nil
        stripped_url = url.to_s

        html.gsub!('OG_REPLACE_URL', stripped_url)

        render html: html.html_safe, layout: false
      end
    end
  end
end
