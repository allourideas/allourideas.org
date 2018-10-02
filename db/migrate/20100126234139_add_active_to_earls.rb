class AddActiveToEarls < ActiveRecord::Migration[4.2]
  def self.up
    add_column :earls, :active, :boolean, :default => true
  end

  def self.down
    remove_column :earls, :active
  end
end
