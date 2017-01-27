class AddShowCantDecideToEarls < ActiveRecord::Migration
  def self.up
    add_column :earls, :show_cant_decide, :boolean, :default => true
  end

  def self.down
    remove_column :earls, :show_cant_decide
  end
end
