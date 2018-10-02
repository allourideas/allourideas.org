class AddHttppasswordToEarls < ActiveRecord::Migration[4.2]
  def self.up
    add_column :earls, :pass, :string
  end

  def self.down
    remove_column :earls, :pass
  end
end
