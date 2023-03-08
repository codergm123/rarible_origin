class CreateTransactions < ActiveRecord::Migration[6.1]
  def change
    create_table :transactions do |t|
      t.integer :buyer_id
      t.integer :seller_id
      t.integer :collection_id
      t.string :currency
      t.string :currency_type
      t.integer :channel

      t.timestamps
    end
  end
end
