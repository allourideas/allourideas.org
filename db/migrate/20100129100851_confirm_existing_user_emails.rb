class ConfirmExistingUserEmails < ActiveRecord::Migration
  def self.up
    User.all.each {|u| u.email_confirmed = true; u.save!}
  end

  def self.down
  end
end
