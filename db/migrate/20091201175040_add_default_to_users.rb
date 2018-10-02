class AddDefaultToUsers < ActiveRecord::Migration[4.2]
  def self.up
    add_column :users, :default, :boolean, :default => false

    User.create(:password => 'chunkybacon', :default => true)
  end

  def self.down
    remove_column :users, :default
  end
end
