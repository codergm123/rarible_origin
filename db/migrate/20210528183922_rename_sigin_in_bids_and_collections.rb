class RenameSiginInBidsAndCollections < ActiveRecord::Migration[6.1]
  def change
    rename_column :collections, :sigin, :sign_instant_sale_price
    rename_column :bids, :sigin, :sign
  end
end
