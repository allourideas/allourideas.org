class DropRefactoredClicksColumns < ActiveRecord::Migration[4.2]
  def self.up
      remove_column :clicks, :sid
      remove_column :clicks, :ip_addr
      remove_column :clicks, :user_agent
  end

  def self.down
      add_column :clicks, :sid, :string
      add_column :clicks, :ip_addr, :string
      add_column :clicks, :user_agent, :string
  end
end
