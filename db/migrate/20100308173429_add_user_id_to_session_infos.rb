class AddUserIdToSessionInfos < ActiveRecord::Migration
  def self.up
	  add_column :session_infos, :user_id, :integer
  end

  def self.down
	  remove_column :session_infos, :user_id
  end
end
