class AddLogoSizeToEarls < ActiveRecord::Migration
  def self.up
	  add_column :earls, :logo_size, :string, :default => "medium"
  end

  def self.down
	  remove_column :earls, :logo_size, :string
  end
end
