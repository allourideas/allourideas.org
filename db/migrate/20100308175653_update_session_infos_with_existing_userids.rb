class UpdateSessionInfosWithExistingUserids < ActiveRecord::Migration[4.2]
  def self.up
	  Click.all.each do |c|
		  session = c.session_info
		  if !session.user && c.user
			  session.user = c.user
			  session.save!
		  end

	  end
  end

  def self.down
  end
end
