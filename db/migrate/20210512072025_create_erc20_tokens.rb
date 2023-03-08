class CreateErc20Tokens < ActiveRecord::Migration[6.1]
  def change
    create_table :erc20_tokens do |t|
      t.string :address
      t.string :chain_id
      t.string :name
      t.string :symbol
      t.integer :decimals
      t.boolean :active, :default => true

      t.timestamps
    end
  end
end
