class AddGoogleAnalyticsCodeToEarls < ActiveRecord::Migration[4.2]
  def self.up
      add_column :earls, :ga_code, :string
  end

  def self.down
      remove_column :earls, :ga_code
  end
end
