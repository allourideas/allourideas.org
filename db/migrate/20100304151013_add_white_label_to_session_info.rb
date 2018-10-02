class AddWhiteLabelToSessionInfo < ActiveRecord::Migration[4.2]
  def self.up
	  add_column :session_infos, :white_label_request, :boolean
	  SessionInfo.update_all('white_label_request = 0')
  end

  def self.down
	  remove_column :session_infos, :white_label_request
  end
end
