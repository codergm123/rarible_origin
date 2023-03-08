class AddErc20ReferanceToCollections < ActiveRecord::Migration[6.1]
  def change
    add_reference :collections, :erc20_token, foreign_key: true
    remove_column :collections, :currency
  end
end
