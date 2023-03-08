class AddContractTypeToNftContracts < ActiveRecord::Migration[6.1]
  def change
    add_column :nft_contracts, :contract_type, :integer, after: :address
  end
end
