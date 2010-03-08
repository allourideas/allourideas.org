class CreateVisitors < ActiveRecord::Migration
  def self.up
    create_table :visitors do |table|
      table.string :remember_token, :default => ""
      table.timestamps
    end

    add_index :visitors, :remember_token

  end

  def self.down
    drop_table :visitors
  end
end
