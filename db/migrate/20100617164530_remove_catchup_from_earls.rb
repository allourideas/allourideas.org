class RemoveCatchupFromEarls < ActiveRecord::Migration
  def self.up
	remove_column :earls, :uses_catchup
  end

  def self.down
	add_column :earls, :uses_catchup, :boolean, :default => false
  end
end
