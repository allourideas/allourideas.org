class RenameWelcomeMsgColumnInEarls < ActiveRecord::Migration[4.2]
  def self.up
	  rename_column :earls, :welcome_msg, :welcome_message
  end

  def self.down
	  rename_column :earls, :welcome_message, :welcome_msg
  end
end
