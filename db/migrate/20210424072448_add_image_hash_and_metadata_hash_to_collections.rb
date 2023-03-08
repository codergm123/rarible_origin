class AddImageHashAndMetadataHashToCollections < ActiveRecord::Migration[6.1]
  def change
    add_column :collections, :image_hash, :string, after: :no_of_copies
    add_column :collections, :metadata_hash, :string, after: :image_hash
  end
end
