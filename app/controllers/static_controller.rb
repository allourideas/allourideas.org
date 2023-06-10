#include Rails.application.routes.url_helpers

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
        flash[:notice] = 'Survey not found'
        redirect_to root_path
      else
        logo_url = ''
        if @earl.logo.attached?
          logo_url = Rails.application.routes.url_helpers.rails_blob_url(@earl.logo)
        end
        file_path = Rails.root.join('public', 'apps', 'aoi_survey', 'dist', 'index.html')
        html = File.read(file_path)
        puts html

        html.gsub!('OG_REPLACE_QUESTION_NAME', @earl.question_name || '')
        html.gsub!('OG_REPLACE_DESCRIPTION', @earl.welcome_message || '')

        if @earl.theme_font_css
          html.gsub!('<style>', @earl.theme_font_css+'<style>')
        end

        html.gsub!('HTTPS://OG_REPLACE_IMAGE_URL', logo_url)
        url = URI.parse(request.original_url)
        url.query = nil
        stripped_url = url.to_s

        html.gsub!('OG_REPLACE_URL', stripped_url)

        render html: html.html_safe, layout: false
      end
    end
  end
end
