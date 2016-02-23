class AddVerifyCodeToEarl < ActiveRecord::Migration
  def self.up
    add_column :earls, :verify_code, :string
  end

  def self.down
    remove_column :earls, :verify_code
  end
end
