#include Rails.application.routes.url_helpers

class StaticController < ApplicationController
  def index
    earlName = params[:earlName]

    # If path is empty or root, render home#index
    if earlName.blank?
      flash[:notice] = 'Survey not found'
      redirect_to root_path
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

        html.gsub!('HTTPS://OG_REPLACE_IMAGE_URL', get_logo_url(@earl.logo))
        url = URI.parse(request.original_url)
        url.query = nil
        stripped_url = url.to_s

        html.gsub!('OG_REPLACE_URL', stripped_url)

        render html: html.html_safe, layout: false
      end
    end
  end

  private

  def get_logo_url(logo)
    begin
      url = logo.blob.url
      if ENV["AWS_CLOUDFLARE_ENDPOINT"].present?
        # Parse the URL to split it into components
        uri = URI.parse(url)

        # Replace the host (e.g. s3.amazonaws.com) with the Cloudflare endpoint host
        # and remove the leading part of the path that matches the host
        cloudflare_host = URI.parse(ENV["AWS_CLOUDFLARE_ENDPOINT"]).host
        uri.host = cloudflare_host
        uri.path = uri.path.gsub(/^\/#{cloudflare_host}/, '')

        url = uri.to_s
      end
      url
    rescue => exception
      puts "Error getting logo URL: #{exception}"
      ""
    end
  end
end
