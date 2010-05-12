class DropRemoteUserFromUserModel < ActiveRecord::Migration
  def self.up
	  remove_column :users, :remote_user_id
  end

  def self.down
	  add_column :users, :remote_user_id, :integer
  end
end
