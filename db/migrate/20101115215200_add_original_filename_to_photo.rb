class AddOriginalFilenameToPhoto < ActiveRecord::Migration
  def self.up
    add_column :photos, :original_file_name, :string
  end

  def self.down
    remove_column :photos, :original_file_name
  end
end
