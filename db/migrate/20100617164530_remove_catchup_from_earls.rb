class RemoveCatchupFromEarls < ActiveRecord::Migration[4.2]
  def self.up
	remove_column :earls, :uses_catchup
  end

  def self.down
	add_column :earls, :uses_catchup, :boolean, :default => false
  end
end
