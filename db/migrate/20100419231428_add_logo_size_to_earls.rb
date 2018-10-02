class AddLogoSizeToEarls < ActiveRecord::Migration[4.2]
  def self.up
	  add_column :earls, :logo_size, :string, :default => "medium"
  end

  def self.down
	  remove_column :earls, :logo_size, :string
  end
end
