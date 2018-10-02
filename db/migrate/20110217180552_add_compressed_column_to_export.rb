class AddCompressedColumnToExport < ActiveRecord::Migration[4.2]
  def self.up
    add_column :exports, :compressed, :boolean, :default => 0
  end

  def self.down
    remove_column :exports, :compressed
  end
end
