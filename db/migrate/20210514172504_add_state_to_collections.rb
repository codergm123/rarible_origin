class AddStateToCollections < ActiveRecord::Migration[6.1]
  def change
    add_column :collections, :state, :integer, default: 1
  end
end
