class AddLogoUrlsToEarls < ActiveRecord::Migration
  def self.up
    add_column :earls, :logo_url, :string
  end

  def self.down
    remove_column :earls, :logo_url
  end
end
