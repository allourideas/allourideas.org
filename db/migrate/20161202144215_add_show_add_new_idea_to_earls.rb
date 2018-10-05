class AddShowAddNewIdeaToEarls < ActiveRecord::Migration[4.2]
  def self.up
    add_column :earls, :show_add_new_idea, :boolean, :default => true
  end

  def self.down
    remove_column :earls, :show_add_new_idea
  end
end
