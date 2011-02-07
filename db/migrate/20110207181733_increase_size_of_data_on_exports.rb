class IncreaseSizeOfDataOnExports < ActiveRecord::Migration
  def self.up
    change_column :exports, :data, :binary, :limit => 16.megabyte
  end

  def self.down
  end
end
