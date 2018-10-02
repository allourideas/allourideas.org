class AddIndexToQuestionIdOnEarls < ActiveRecord::Migration[4.2]
  def self.up
    add_index :earls, :question_id
  end

  def self.down
    remove_index :earls, :question_id
  end
end
