class AddPromptAlgorithmToEarl < ActiveRecord::Migration
  def self.up
    add_column :earls, :prompt_algorithm, :string
  end

  def self.down
    remove_column :earls, :prompt_algorithm
  end
end
