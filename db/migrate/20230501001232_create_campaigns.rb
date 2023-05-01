class CreateCampaigns < ActiveRecord::Migration[7.0]
  def change
    create_table :campaigns do |t|
      t.json :configuration
      t.integer :user_id, null: false
      t.integer :post_id
      t.integer :group_id
      t.integer :community_id
      t.integer :domain_id
      t.string :question_code
      t.integer :question_id
      t.boolean :deleted, null: false, default: false
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :campaigns, :configuration, type: :fulltext
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
