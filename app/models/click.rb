class Click < ActiveResource::Base
  self.site = HOST

  attr_accessor :user_id, :what_was_clicked, :additional_info
  
  def self.record(sid, clicked_on, user = nil)
    if user
      click = Click.new(:sid => sid, :user_id => user.remote_user_id, :what_was_clicked => clicked_on)
    else
      click = Click.new(:sid => sid, :what_was_clicked => clicked_on)
    end
    click.save
  end
end
