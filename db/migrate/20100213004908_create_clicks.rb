class CreateClicks < ActiveRecord::Migration
  def self.up
    create_table :clicks do |table|
      table.string :sid
      table.integer :user_id
      table.string :ip_addr
      table.string :controller
      table.string :action
      table.string :url 
      table.timestamps
    end

  end

  def self.down
    drop_table :clicks
  end
end
