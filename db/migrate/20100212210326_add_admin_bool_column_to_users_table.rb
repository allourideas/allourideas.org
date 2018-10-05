class AddAdminBoolColumnToUsersTable < ActiveRecord::Migration[4.2]
  def self.up
      add_column :users, :admin, :boolean, :default => false
  end

  def self.down
      remove_column :users, :admin
  end
end
