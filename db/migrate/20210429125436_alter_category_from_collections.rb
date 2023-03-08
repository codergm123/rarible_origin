class AlterCategoryFromCollections < ActiveRecord::Migration[6.1]
  def change
    change_column :collections, :category, :string
    change_column :collections, :unlock_on_purchase, :boolean, default: false
    add_column :collections, :royalty, :decimal, default: 0
  end
end
