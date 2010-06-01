class AddPhotosModel < ActiveRecord::Migration
  def self.up
    create_table :photos do |table|
      table.string :image_file_name, :default => ""
      table.string :image_content_type, :default => ""
      table.integer :image_file_size
      table.datetime :image_updated_at
      table.timestamps
    end
  end

  def self.down
    drop_table :photos
  end
end
