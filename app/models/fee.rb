class Fee < ApplicationRecord
  validates :name, :fee_type, :percentage, presence: true

  def self.default_service_fee
    service_fee = where(fee_type: :service_charge).first
    service_fee ? service_fee.percentage : Rails.application.credentials.default_fees[:service_fee]
  end
end
