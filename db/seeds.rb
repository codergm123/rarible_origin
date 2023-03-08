# Admin User
CHAIN_ID = Rails.env.development? ? 4 : 1
AdminUser.find_or_create_by(email: "admin@powned.co")
  .update(password: "3995efba-a8a6-41a0-8e83-6b66f35ab300", first_name: "Admin", last_name: "User", password_confirmation: "3995efba-a8a6-41a0-8e83-6b66f35ab300")

Fee.find_or_create_by(fee_type: 'service_charge')
  .update(name: 'Service Charge', percentage: '2.5')

["Art", "Animation", "Games", "Music", "Videos", "Memes", "Metaverses"].each { |c| Category.find_or_create_by(name: c) }

#Creating ERC20 Token List
Erc20Token.find_or_create_by(chain_id: CHAIN_ID, symbol: 'WETH')
  .update(address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', name: 'Wrapped Ether', decimals: 18)

### CREATING SHARED NFT CONTRACT ADDRESSES
NftContract.find_or_create_by(contract_type: 'nft721', symbol: 'Shared')
  .update(name: 'NFT', address: '0xc879b3be587d43811Ab2B81b600040A0C7c84daf')
NftContract.find_or_create_by(contract_type: 'nft1155', symbol: 'Shared')
  .update(name: 'NFT', address: '0xEc5e81Ce8342983F5a9926869A7a582358111782')
