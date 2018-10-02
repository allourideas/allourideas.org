class ConfirmExistingUserEmails < ActiveRecord::Migration[4.2]
  def self.up
    User.all.each {|u| u.email_confirmed = true; u.save!}
  end

  def self.down
  end
end
