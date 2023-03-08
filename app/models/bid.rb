class Bid < ApplicationRecord
  include AASM

  belongs_to :user
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'
  belongs_to :collection
  belongs_to :erc20_token

  has_paper_trail on: [:create, :update]

  validates :user_id, :collection_id, :owner_id, :amount, :state, presence: true

  default_scope { where.not(state: [:cancelled,:expired]) }
  scope :by_desc, lambda { order('created_at desc') }

  after_create :send_notification
  after_update :send_cancel_notification

  enum state: {
      pending: 1,
      approved: 2,
      executed: 3,
      expired: 4,
      cancelled: 5
    }

  aasm column: :state, enum: true, whiny_transitions: false do
    state :pending, initial: true, if: :is_eligible_for_bid?
    state :approved
    state :executed

    event :execute_bidding, after: :send_accept_notification do
      transitions from: :pending, to: :executed
    end

    event :expire_bid do
      transitions from: :pending, to: :expired, if: :is_date_expired?
    end

    event :cancel_bid do
      transitions from: :pending, to: :cancelled
    end
  end

  def send_accept_notification
    Notification.notify_bid_accept(self)
  end

  def is_highest_bid?
    #Need crypto currency conversion
    self.collection.bids.pluck('amount').max == self.amount
  end

  def is_date_expired?
    #expire allowance days from common application configuration or collection level.??
    col = self.collection
    ((self.created_at + eval(col.expire_bid_days)) < Time.now) if col.expire_bid_days
  end

  def is_eligible_for_bid?
    self.collection.put_on_sale
  end

  def value
    "#{self.crypto_currency} #{self.crypto_currency_type}"
  end

  def crypto_currency
    self.amount
  end

  def crypto_currency_type
    self.erc20_token.symbol rescue nil
  end

  def crypto_currency=(amt)
    self.amount=amt
  end

  def crypto_currency_type=(sym)
    self.erc20_token_id = Erc20Token.where(:symbol=>sym).first.id rescue nil
  end

  def desc
    "#{value} for #{quantity} edition(s)"
  end

  private

  def send_notification
    Notification.notify_new_bid(self)
  end
  
  def send_cancel_notification
    Notification.notify_expire_bid(self) if self.expired?
  end
end
