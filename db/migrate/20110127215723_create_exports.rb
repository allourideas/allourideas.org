class CreateExports < ActiveRecord::Migration[4.2]
  def self.up
    create_table :exports do |table|
      table.binary :data
      table.string :name, :default => ""
      table.timestamps
    end
    add_index :exports, :name

  end

  def self.down
    drop_table :exports
  end
end
