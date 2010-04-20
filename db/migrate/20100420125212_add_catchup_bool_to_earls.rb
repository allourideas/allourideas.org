class AddCatchupBoolToEarls < ActiveRecord::Migration
  def self.up
	  add_column :earls, :uses_catchup, :boolean, :default => false
  end

  def self.down
	  remove_column :earls, :uses_catchup, :boolean
  end
end
