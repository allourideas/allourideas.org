class AddSessionInfoIndexToClicks < ActiveRecord::Migration[4.2]
  def self.up
    add_index :clicks, :session_info_id
  end

  def self.down
    remove_index :clicks, :session_info_id
  end
end
