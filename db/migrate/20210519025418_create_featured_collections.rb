class CreateFeaturedCollections < ActiveRecord::Migration[6.1]
  def change
    create_table :featured_collections do |t|
      t.references :collection, null: false, foreign_key: true

      t.timestamps
    end
  end
end
