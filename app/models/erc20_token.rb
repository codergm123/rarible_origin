class Erc20Token < ApplicationRecord

  def self.select_options
    all.map { |token| [token.symbol.upcase, token.id, {address: token.address, decimals: token.decimals}] }
  end

  def currency_symbol
    symbol.upcase
  end

end
