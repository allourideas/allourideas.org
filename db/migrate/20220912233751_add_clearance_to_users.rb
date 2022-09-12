class AddClearanceToUsers < ActiveRecord::Migration[7.0]
  def self.up
    add_index :users, :confirmation_token, unique: true
  end

  def self.down
    remove_index :users, :confirmation_token, unique: true
  end
end
