class AddVerifyCodeToEarl < ActiveRecord::Migration[4.2]
  def self.up
    add_column :earls, :verify_code, :string
  end

  def self.down
    remove_column :earls, :verify_code
  end
end
