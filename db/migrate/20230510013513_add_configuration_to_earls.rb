class AddConfigurationToEarls < ActiveRecord::Migration[7.0]
  def change
    add_column :earls, :configuration, :json
    add_column :users, :configuration, :json
  end
end
