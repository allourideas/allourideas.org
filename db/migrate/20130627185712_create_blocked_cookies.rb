class CreateBlockedCookies < ActiveRecord::Migration
  def self.up
    create_table :blocked_cookies do |table|
      table.string :referrer, :default => ""
      table.integer :question_id
      table.string :user_agent, :default => ""
      table.string :ip_addr, :default => ""
      table.string :source, :default => ""
      table.string :session_id, :default => ""
      table.timestamps
    end

  end

  def self.down
    drop_table :blocked_cookies
  end
end
