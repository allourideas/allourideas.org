class AddUserIdToEarls < ActiveRecord::Migration
  def self.up
    add_column :earls, :user_id, :integer
  end

  def self.down
    remove_column :earls, :user_id
  end
end
