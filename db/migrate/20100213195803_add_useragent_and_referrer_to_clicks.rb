class AddUseragentAndReferrerToClicks < ActiveRecord::Migration[4.2]
  def self.up
	  add_column :clicks, :referrer, :string
	  add_column :clicks, :user_agent, :string
  end

  def self.down
	  remove_column :clicks, :referrer
	  remove_column :clicks, :user_agent
  end
end
