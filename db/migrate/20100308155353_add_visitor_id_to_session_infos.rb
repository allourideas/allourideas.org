class AddVisitorIdToSessionInfos < ActiveRecord::Migration[4.2]
  def self.up
	  add_column :session_infos, :visitor_id, :integer
  end

  def self.down
	  remove_column :session_infos, :visitor_id
  end
end
