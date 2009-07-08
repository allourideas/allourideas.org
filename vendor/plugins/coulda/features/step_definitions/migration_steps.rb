Then /^the paperclip migration should add "(.*)" columns to the "(.*)"$/ do |attr, table|
  assert_generated_migration(table) do
    "      add_column :#{table}, :#{attr}_file_name,    :string,   :default => \"\"\n"  <<
    "      add_column :#{table}, :#{attr}_content_type, :string,   :default => \"\"\n"  <<
    "      add_column :#{table}, :#{attr}_file_size,    :integer,  :default => \"\"\n" <<
    "      add_column :#{table}, :#{attr}_updated_at,   :datetime, :default => \"\""
  end
  assert_generated_migration(table) do
    "      remove_column :#{table}, :#{attr}_file_name\n"    <<
    "      remove_column :#{table}, :#{attr}_content_type\n" <<
    "      remove_column :#{table}, :#{attr}_file_size\n"    <<
    "      remove_column :#{table}, :#{attr}_updated_at"
  end
end

Then /^the "(.*)" table should have db index on "(.*)"$/ do |table, foreign_key|
  assert_generated_migration(table) do
    "add_index :#{table}, :#{foreign_key}"
  end
end

Then /^the "(.*)" table should have paperclip columns for "(.*)"$/ do |table, attr|
  assert_generated_migration(table) do
    "      table.string :#{attr}_file_name, :default => \"\"\n"    <<
    "      table.string :#{attr}_content_type, :default => \"\"\n" <<
    "      table.integer :#{attr}_file_size\n"   <<
    "      table.datetime :#{attr}_updated_at"
  end
end

