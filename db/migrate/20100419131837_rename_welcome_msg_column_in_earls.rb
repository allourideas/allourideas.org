class RenameWelcomeMsgColumnInEarls < ActiveRecord::Migration
  def self.up
	  rename_column :earls, :welcome_msg, :welcome_message
  end

  def self.down
	  rename_column :earls, :welcome_message, :welcome_msg
  end
end
