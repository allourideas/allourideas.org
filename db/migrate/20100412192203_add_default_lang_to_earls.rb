class AddDefaultLangToEarls < ActiveRecord::Migration
  def self.up
	  add_column :earls, :default_lang, :string, :default => "en"
  end

  def self.down
	  remove_column :earls, :default_lang
  end
end
