class CreateNftContracts < ActiveRecord::Migration[6.1]
  def change
    create_table :nft_contracts do |t|
      t.string :name
      t.string :symbol
      t.string :address
      t.references :owner, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
