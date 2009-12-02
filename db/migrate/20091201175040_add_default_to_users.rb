class AddDefaultToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :default, :boolean, :default => false
    
    User.create(:password => 'chunkybacon', :password_confirmation => 'chunkybacon', :default => true)
  end

  def self.down
    remove_column :users, :default
  end
end
