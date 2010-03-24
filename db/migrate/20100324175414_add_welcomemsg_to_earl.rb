class AddWelcomemsgToEarl < ActiveRecord::Migration
  def self.up
	  add_column :earls, :welcome_msg, :string
  end

  def self.down
	  remove_column :earls, :welcome_msg
  end
end
