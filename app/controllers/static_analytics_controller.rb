class StaticAnalyticsController < ApplicationController
  def index
    earlName = params[:earlName]

    file_path = Rails.root.join('public', 'apps', 'analytics_and_promotion', 'dist', 'index.html')
    html = File.read(file_path)

   render html: html.html_safe, layout: false
  end
end
