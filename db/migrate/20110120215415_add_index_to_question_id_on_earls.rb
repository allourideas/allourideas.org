class AddIndexToQuestionIdOnEarls < ActiveRecord::Migration
  def self.up
    add_index :earls, :question_id
  end

  def self.down
    remove_index :earls, :question_id
  end
end
