class PopulateSessionInfoTable < ActiveRecord::Migration
  def self.up
    add_column :clicks, :session_info_id, :integer

    clicks = Click.all
    clicks.each do |c|
      session = SessionInfo.find_or_create_by(:session_id => c.sid,
                                              :ip_addr => c.ip_addr,
                                              :user_agent => c.user_agent)

      c.session_info = session
      c.save
    end
  end

  def self.down
    remove_column :clicks, :session_info_id
  end
end
