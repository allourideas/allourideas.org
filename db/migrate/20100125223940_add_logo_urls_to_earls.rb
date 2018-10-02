class AddLogoUrlsToEarls < ActiveRecord::Migration[4.2]
  def self.up
    add_column :earls, :logo_url, :string
  end

  def self.down
    remove_column :earls, :logo_url
  end
end
