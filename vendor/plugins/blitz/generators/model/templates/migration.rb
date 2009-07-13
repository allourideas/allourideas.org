class <%= migration_name %> < ActiveRecord::Migration
  def self.up
    create_table :<%= table_name %> do |table|
<% attributes.each do |attribute| -%>
<% if attribute.type == :paperclip -%>
      table.string :<%= attribute.name %>_file_name, :default => ""
      table.string :<%= attribute.name %>_content_type, :default => ""
      table.integer :<%= attribute.name %>_file_size
      table.datetime :<%= attribute.name %>_updated_at
<% elsif attribute.type == :string -%>
      table.string :<%= attribute.name %>, :default => ""
<% else -%>
      table.<%= attribute.type %> :<%= attribute.name %>
<% end -%>
<% end -%>
<% unless options[:skip_timestamps] -%>
      table.timestamps
<% end -%>
    end

<% attributes.select(&:reference?).each do |attribute| -%>
    add_index :<%= table_name %>, :<%= attribute.name %>_id
<% end -%>
  end

  def self.down
<% attributes.select(&:reference?).each do |attribute| -%>
    remove_index :<%= table_name %>, :<%= attribute.name %>_id
<% end -%>
    drop_table :<%= table_name %>
  end
end
