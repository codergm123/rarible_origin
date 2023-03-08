class AddAmountWithFeeInBids < ActiveRecord::Migration[6.1]
  def change
    add_column :bids, :amount_with_fee, :decimal, precision: 32, scale: 16
  end
end
