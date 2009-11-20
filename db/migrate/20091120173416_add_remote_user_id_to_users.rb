class AddRemoteUserIdToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :remote_user_id, :integer
  end

  def self.down
    remove_column :users, :remote_user_id
  end
end
