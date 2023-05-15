class AnalyticsController < ApplicationController
   include PlausibleHelper

   #before_action :authenticate_user!
   before_action :authorize_edit_group_marketing
   skip_before_action :verify_authenticity_token
   skip_before_action :record_action

   def plausible_stats_proxy
     begin
       plausible_data = plausible_stats_proxy_helper(params[:plausibleUrl], { questionId: params[:questionId] })
       render json: plausible_data
     rescue => error
       Rails.logger.error("Could not get plausibleStatsProxy: #{error}")
       head :internal_server_error
     end
   end

   def get_plausible_series
      begin
        question_mark_index = request.url.index('?')
        query_string = request.url[question_mark_index + 1..-1]
        site_id = ENV['PLAUSIBLE_SITE_NAME']
        type = params[:type].gsub('realtime-visitors', 'realtime/visitors')
        plausible_string = "#{type}?#{query_string}&site_id=#{site_id}"
        plausible_data = get_plausible_stats(plausible_string)
        Rails.logger.info("GOT DATA")
        Rails.logger.info(plausible_data)
        render json: plausible_data
      rescue => error
        Rails.logger.error("Could not get getPlausibleSeries: #{error}")
        head :internal_server_error
      end
    end

    def create_activity_from_app
      puts params
      work_data = {
        body: {
          actor: params[:actor],
          type: params[:type],
          object: params[:object],
          path_name: params[:path_name],
          context: params[:context],
          event_time: params[:event_time],
          sessionId: params[:sessionId],
          user_agent: params[:user_agent],
          userLocale: params[:userLocale],
          userAutoTranslate: params[:userAutoTranslate],
          screen_width: params[:screen_width],
          originalQueryString: params[:originalQueryString],
          referrer: params[:referrer],
          url: params[:url],
          ip_address: request.remote_ip,
          server_timestamp: Time.now.to_i
        },
        userId: current_user ? current_user.id : nil,
        questionId: params[:questionId] || nil,
        earlId: params[:earlId] || nil,
        promptId: params[:promptId] || nil,
        earlName: params[:earlName] || nil
      }

      #TODO: Move to delayed job
      delayed_create_activity_from_app(work_data)
      head :ok
    end

   private

   def authorize_edit_group_marketing
     # Add the authorization logic here
   end
 end