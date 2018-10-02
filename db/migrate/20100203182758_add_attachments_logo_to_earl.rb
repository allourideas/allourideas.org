class AddAttachmentsLogoToEarl < ActiveRecord::Migration[4.2]
  def self.up
    add_column :earls, :logo_file_name, :string
    add_column :earls, :logo_content_type, :string
    add_column :earls, :logo_file_size, :integer
    add_column :earls, :logo_updated_at, :datetime
    remove_column :earls, :logo_url
  end

  def self.down
    remove_column :earls, :logo_file_name
    remove_column :earls, :logo_content_type
    remove_column :earls, :logo_file_size
    remove_column :earls, :logo_updated_at
    add_column :earls, :logo_url, :string
  end
end
