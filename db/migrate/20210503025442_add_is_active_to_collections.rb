class AddIsActiveToCollections < ActiveRecord::Migration[6.1]
  def change
    add_column :collections, :is_active, :boolean, default: true
  end
end
