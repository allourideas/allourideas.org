class AddGoogleAnalyticsCodeToEarls < ActiveRecord::Migration
  def self.up
      add_column :earls, :ga_code, :string
  end

  def self.down
      remove_column :earls, :ga_code
  end
end
