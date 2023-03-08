class ChangeContractTypeToNftContractIdInCollections < ActiveRecord::Migration[6.1]
  def change
    remove_column :collections, :contract_type
    add_reference :collections, :nft_contracts, index: true
  end
end
