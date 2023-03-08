class AddInstantSaleEnabledToCollection < ActiveRecord::Migration[6.1]
  def change
    add_column :collections, :instant_sale_enabled, :boolean, default: false
  end
end
