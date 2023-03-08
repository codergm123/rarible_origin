class Transaction < ApplicationRecord
  self.per_page = 10

  belongs_to :seller, class_name: 'User'
  belongs_to :buyer, class_name: 'User'
  belongs_to :collection

  enum channel: {
    bid: 1,
    direct: 2
  }
end
