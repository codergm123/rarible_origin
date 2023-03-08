class ChangeColumnInBid < ActiveRecord::Migration[6.1]
  def change
    remove_column :bids, :crypto_currency
    remove_column :bids, :crypto_currency_type

    add_column :bids, :amount, :decimal
    add_column :bids, :erc20_token_id, :integer
  end
end
