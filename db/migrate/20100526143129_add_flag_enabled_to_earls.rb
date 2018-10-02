class AddFlagEnabledToEarls < ActiveRecord::Migration[4.2]
  def self.up
	  add_column :earls, :flag_enabled, :boolean, :default => false
  end

  def self.down
	  remove_column :earls, :flag_enabled
  end
end
