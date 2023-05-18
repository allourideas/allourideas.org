 # app/controllers/campaigns_controller.rb
class CampaignsController < ApplicationController
  skip_before_action :verify_authenticity_token
  #before_action :authenticate_user!
  #before_action :authorize_group_marketing

  def index
    puts "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    begin
      campaigns = Campaign.where(question_id: params[:question_id])
                          .select(:id, :configuration)
                          .order(created_at: :desc)
      render json: campaigns.as_json(root: false)
    rescue => error
      logger.error "Could not get campaigns: #{error.message}"
      head :internal_server_error
    end
  end

  def create
    begin
      campaign = Campaign.new(
        question_id: params[:question_id],
        configuration: params[:configuration],
        user_id: current_user.id
      )

      # TODO: Toxicity check

      if campaign.save
        render json: campaign.as_json(root: false)
      else
        head :unprocessable_entity
      end
    rescue => error
      logger.error "Could not create_campaign campaigns: #{error.message}"
      head :internal_server_error
    end
  end

  def update
    begin
      campaign = Campaign.find_by(id: params[:campaign_id], question_id: params[:question_id])

      if campaign.present?
        campaign.configuration = params[:configuration]

        # TODO: Toxicity check

        if campaign.save
          render json: campaign.as_json(root: false)
        else
          head :unprocessable_entity
        end
      else
        head :not_found
      end
    rescue => error
      logger.error "Could not update_campaign campaigns: #{error.message}"
      head :internal_server_error
    end
  end

  def destroy
    begin
      campaign = Campaign.find_by(id: params[:campaign_id], question_id: params[:question_id])

      if campaign.present?
        campaign.deleted = true

        if campaign.save
          head :ok
        else
          head :unprocessable_entity
        end
      else
        head :not_found
      end
    rescue => error
      logger.error "Could not delete_campaign campaigns: #{error.message}"
      head :internal_server_error
    end
  end

  private

  def authorize_group_marketing
    # Replace this with your own authorization logic
    unless current_user.can_edit_group_marketing?
      head :forbidden
    end
  end
end
