class CreateFees < ActiveRecord::Migration[6.1]
  def change
    create_table :fees do |t|
      t.string :name
      t.string :fee_type
      t.string :price
      t.string :percentage

      t.timestamps
    end
  end
end
