class AddSaleCurrencyToCollections < ActiveRecord::Migration[6.1]
  def change
    add_column :collections, :currency, :string
  end
end
