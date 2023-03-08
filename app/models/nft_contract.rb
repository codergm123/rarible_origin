class NftContract < ApplicationRecord

  enum contract_type: [:nft721, :nft1155]

  def self.get_shared_id type
    type == 'single' ? where(symbol: 'Shared', contract_type: :nft721).first&.id : where(symbol: 'Shared', contract_type: :nft1155).first&.id
  end

  def shared?
    symbol == 'Shared'
  end

  def masked_address(first_char=13, last_char=4)
    "#{address[0..first_char]}...#{address.split(//).last(last_char).join("").to_s}"
  end

  def contract_asset_type
    nft1155? ? 0 : 1
  end
end
