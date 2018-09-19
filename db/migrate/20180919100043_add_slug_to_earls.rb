class AddSlugToEarls < ActiveRecord::Migration[5.2]
  def change
    add_column :earls, :slug, :string
  end
end
