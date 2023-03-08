class AddSignToCollections < ActiveRecord::Migration[6.1]
  def change
    add_column :collections, :sigin, :string
  end
end
