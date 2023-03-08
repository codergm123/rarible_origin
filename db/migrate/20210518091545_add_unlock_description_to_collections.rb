class AddUnlockDescriptionToCollections < ActiveRecord::Migration[6.1]
  def change
    add_column :collections, :unlock_description, :string
  end
end
