class AssociateExistingEarlsWithUsers < ActiveRecord::Migration[4.2]
  def self.up
    Earl.all.each {|e| (e.user_id = e.question(true).local_identifier.to_i; e.save!) if e.user_id.blank? }
  end

  def self.down
  end
end
