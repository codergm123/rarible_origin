class AddNftContractToCollections < ActiveRecord::Migration[6.1]
  def change
    add_reference :collections, :nft_contract, foreign_key: true
  end
end
