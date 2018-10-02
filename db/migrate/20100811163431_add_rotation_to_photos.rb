class AddRotationToPhotos < ActiveRecord::Migration[4.2]
  def self.up
     add_column :photos, :rotation, :integer, :default => 0
  end

  def self.down
     remove_column :photos, :rotation
  end
end
