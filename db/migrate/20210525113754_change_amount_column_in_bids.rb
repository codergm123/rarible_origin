class ChangeAmountColumnInBids < ActiveRecord::Migration[6.1]
  def change
    change_column :bids, :amount, :decimal, :precision => 32, :scale => 16
  end
end
