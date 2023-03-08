class RemoveReferanceFromCollections < ActiveRecord::Migration[6.1]
  def change
    remove_reference :collections, :nft_contracts, index: true
  end
end
