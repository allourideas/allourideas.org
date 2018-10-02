class AddUserIdToEarls < ActiveRecord::Migration[4.2]
  def self.up
    add_column :earls, :user_id, :integer
  end

  def self.down
    remove_column :earls, :user_id
  end
end
