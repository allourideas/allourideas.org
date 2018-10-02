class AddPhotocracyFlagToEarls < ActiveRecord::Migration[4.2]
  def self.up
     add_column :earls, :photocracy, :boolean, :default => false
  end

  def self.down
     remove_column :earls, :photocracy
  end
end
