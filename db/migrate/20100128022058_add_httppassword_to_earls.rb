class AddHttppasswordToEarls < ActiveRecord::Migration
  def self.up
    add_column :earls, :pass, :string
  end

  def self.down
    remove_column :earls, :pass
  end
end
