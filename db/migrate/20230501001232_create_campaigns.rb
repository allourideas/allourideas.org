class CreateCampaigns < ActiveRecord::Migration[7.0]
  def change


    add_index :campaigns, [:id, :group_id, :deleted]
    add_index :campaigns, [:id, :community_id, :deleted]
    add_index :campaigns, [:id, :domain_id, :deleted]
    add_index :campaigns, [:id, :post_id, :deleted]
    add_index :campaigns, [:id, :question_id, :deleted]
    add_index :campaigns, [:id, :question_code, :deleted]
    add_index :campaigns, [:id, :user_id, :deleted]
    add_index :campaigns, [:id, :group_id, :deleted, :active]
    add_index :campaigns, [:id, :community_id, :deleted, :active]
    add_index :campaigns, [:id, :domain_id, :deleted, :active]
    add_index :campaigns, [:id, :post_id, :deleted, :active]
    add_index :campaigns, [:id, :user_id, :deleted, :active]
  end
end
