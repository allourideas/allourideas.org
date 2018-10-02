class AddUserIdToSessionInfos < ActiveRecord::Migration[4.2]
  def self.up
	  add_column :session_infos, :user_id, :integer
  end

  def self.down
	  remove_column :session_infos, :user_id
  end
end
