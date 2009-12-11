class Click < ActiveResource::Base
  self.site = API_HOST
  self.user = PAIRWISE_USERNAME
  self.password = PAIRWISE_PASSWORD

  attr_accessor :user_id, :what_was_clicked, :additional_info
  
  def self.record(sid, clicked_on, user = nil)
    # if user
    #   click = Click.new(:sid => sid, :what_was_clicked => clicked_on)
    # else #for now, the same
    #   click = Click.new(:sid => sid, :what_was_clicked => clicked_on)
    # end
    # click.save
    return true
  end
end
