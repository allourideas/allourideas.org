class AddSecondLocInfoToSessionInfo < ActiveRecord::Migration[4.2]
  def self.up
      add_column :session_infos, :loc_info_2, :string, :default => ""
  end

  def self.down
      remove_column :session_infos, :loc_info_2, :string, :default => ""
  end
end
