class AddQuantityToBids < ActiveRecord::Migration[6.1]
  def change
    add_column :bids, :quantity, :integer, default: 1
  end
end
