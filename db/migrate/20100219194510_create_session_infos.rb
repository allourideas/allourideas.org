class CreateSessionInfos < ActiveRecord::Migration[4.2]
  def self.up
    create_table :session_infos do |table|
      table.string :session_id
      table.string :ip_addr
      table.string :user_agent
      table.string :loc_info, :default => ""
      table.timestamps
    end

    add_index :session_infos, :session_id

  end

  def self.down
    drop_table :session_infos
  end
end
