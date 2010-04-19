class ResizeWelcomeMessageColumn < ActiveRecord::Migration
  def self.up
	  change_column :earls, :welcome_message, :string, :limit => 300
  end

  def self.down
	  change_column :earls, :welcome_message, :string, :limit => 255
  end
end
