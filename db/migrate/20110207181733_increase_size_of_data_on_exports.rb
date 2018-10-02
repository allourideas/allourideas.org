class IncreaseSizeOfDataOnExports < ActiveRecord::Migration[4.2]
  def self.up
    change_column :exports, :data, :binary, :limit => 16.megabyte
  end

  def self.down
  end
end
