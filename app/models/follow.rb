class Follow < ApplicationRecord
  belongs_to :follower, class_name: 'User'
  belongs_to :followee, class_name: 'User'
  
  has_paper_trail on: [:create, :update]
  after_create :send_notification

  private

  def send_notification
    Notification.notify_following(self)
  end
end
