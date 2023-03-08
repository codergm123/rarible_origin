class ChangeInstantPriceDecimalInCollections < ActiveRecord::Migration[6.1]
  def change
    change_column :collections, :instant_sale_price, :decimal, :precision => 32, :scale => 16
  end
end
