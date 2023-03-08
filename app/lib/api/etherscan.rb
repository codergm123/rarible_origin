module Api
  class Etherscan
    ZERO = 0.0
    COINGECKO_IDS = {'weth': 'weth'}

    def contract_abi(contract_address)
      options = {:open_timeout => 10, :read_timeout => 70, :parse_result => true, :url => Rails.application.credentials.etherscan[:api_url]}
      api = Web3::Eth::Etherscan.new(Rails.application.credentials.etherscan[:api_key], connect_options: options)
      api.contract_getabi(address: contract_address)
    end

    def self.usd_price currency='eth'
      currency == 'eth' ? eth_price : erc20_price(currency)
    end

    def self.eth_price
      uri = URI.parse(Rails.application.credentials.etherscan.dig(:api_url) + "?module=stats&action=ethprice&apikey=#{Rails.application.credentials.etherscan[:api_key]}")
      request = Net::HTTP::Get.new(uri)
      request.content_type = "application/json"
      req_options = {
        use_ssl: uri.scheme == "https",
        open_timeout: 5,
        read_timeout: 5,
      }
      response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
      response.code == '200' ? JSON.parse(response.body)['result']['ethusd'].to_f : ZERO
    end

    def self.erc20_price currency='weth', fiat='usd'
      uri = URI.parse(Rails.application.credentials.config[:coingecko_url] + "?ids=#{COINGECKO_IDS[currency.to_sym]}&vs_currencies=#{fiat}")
      request = Net::HTTP::Get.new(uri)
      request.content_type = "application/json"
      req_options = {
        use_ssl: uri.scheme == "https",
        open_timeout: 5,
        read_timeout: 5,
      }
      response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
      response.code == '200' ? JSON.parse(response.body)[COINGECKO_IDS[currency.to_sym]][fiat].to_f : ZERO
    end
  end
end