class CreateCollections < ActiveRecord::Migration[6.1]
  def change
    create_table :collections do |t|
      t.string :address, null: false
      t.string :name
      t.text :description
      t.boolean :put_on_sale
      t.decimal :instant_sale_price
      t.boolean :unlock_on_purchase
      t.integer :contract_type
      t.integer :collection_type
      t.integer :category
      t.integer :position, default: 1
      t.integer :no_of_copies, default: 1
      t.references :creator, foreign_key: { to_table: :users }
      t.references :owner, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
