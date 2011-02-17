class AddCompressedColumnToExport < ActiveRecord::Migration
  def self.up
    add_column :exports, :compressed, :boolean, :default => 0
  end

  def self.down
    remove_column :exports, :compressed
  end
end
