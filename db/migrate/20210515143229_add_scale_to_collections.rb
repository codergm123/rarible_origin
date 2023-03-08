class AddScaleToCollections < ActiveRecord::Migration[6.1]
  def change
    change_column :collections, :instant_sale_price, :decimal, precision: 15, scale: 5
  end
end
