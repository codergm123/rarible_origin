class CreateBids < ActiveRecord::Migration[6.1]
  def change
    create_table :bids do |t|
      t.integer :user_id
      t.integer :collection_id
      t.string :crypto_currency_type
      t.string :crypto_currency
      t.datetime :register_date
      t.boolean :is_active
      t.integer :state

      t.timestamps
    end
  end
end
