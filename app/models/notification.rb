class Notification < ApplicationRecord
  include Rails.application.routes.url_helpers

  belongs_to :from_user, class_name: 'User', foreign_key: 'from_user_id', optional: true
  belongs_to :to_user, class_name: 'User', foreign_key: 'to_user_id'

  default_scope { order("created_at desc") }
  scope :unread, lambda { |user| where("to_user_id=? and is_read=?", user.id, false) }

  def self.collection_image_url(collection)
    Rails.application.routes.default_url_options[:host] = Rails.application.credentials.config[:app_url] || 'localhost:3000'
    attachment = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'].include?(collection.attachment.content_type) ? collection.get_attachment(nil) : collection.cover
    attachment.present? ? Rails.application.routes.url_helpers.url_for(attachment) : '/assets/banner-1.png'
  end

  def self.notify_put_on_sale(collection)
    return unless collection.present?
    message = I18n.t("notifications.put_on_sale", owner_name: collection.owner.full_name)
    image_url = collection_image_url(collection)
    create_notification({ to_user: collection.owner_id, message: message, path: "/collections/#{collection.address}", image_url: image_url })
  end

  def self.notify_price_update(collection)
    return unless collection.present?
    message = I18n.t("notifications.price_updated", price: collection.instant_sale_price, owner_name: collection.owner.full_name)
    image_url = collection_image_url(collection)
    create_notification({ to_user: collection.owner_id, message: message, path: "/collections/#{collection.address}", image_url: image_url })
  end

  def self.notify_ownership_transfer(collection, old_owner_id)
    old_owner = User.find_by_id(old_owner_id)
    message = I18n.t("notifications.ownership_transfer", buyer_name: collection.owner.full_name, owner_name: old_owner&.full_name)
    image_url = collection_image_url(collection)
    create_notification({ to_user: collection.owner_id, message: message, path: "/collections/#{collection.address}", image_url: image_url })
  end

  def self.notify_new_bid(bid)
    return unless bid.present?
    message = I18n.t("notifications.new_bid", buyer_name: bid.user.full_name)
    image_url = collection_image_url(bid.collection)
    create_notification({ to_user: bid.collection.owner_id, message: message, path: "/collections/#{bid.collection.address}", image_url: image_url })
  end

  def self.notify_bid_accept(bid)
    return unless bid.present?
    message = I18n.t("notifications.bid_accept", owner_name: bid.collection.owner.full_name)
    image_url = collection_image_url(bid.collection)
    create_notification({ to_user: bid.user_id, message: message, path: "/collections/#{bid.collection.address}", image_url: image_url })
  end

  def self.notify_expire_bid(bid)
    return unless bid.present?
    message = I18n.t("notifications.expire_bid", owner_name: bid.collection.owner.full_name)
    image_url = collection_image_url(bid.collection)
    create_notification({ to_user: bid.user_id, message: message, path: "/collections/#{bid.collection.address}", image_url: image_url })
  end

  def self.notify_profile_verified(user)
    return unless user.present?
    Rails.application.routes.default_url_options[:host] = Rails.application.credentials.config[:app_url] || 'localhost:3000'
    image_url = Rails.application.routes.url_helpers.url_for(user.profile_image(:icon))
    create_notification({ to_user: user.id, message: I18n.t("notifications.profile_verified"), path: "/users/#{user.address}", image_url: image_url })
  end

  def self.notify_burn_token(collection)
    return unless collection.present?
    message = I18n.t("notifications.burn_token", collection_name: collection.title, owner_name: collection.owner.full_name)
    image_url = collection_image_url(collection)
    create_notification({ to_user: collection.owner_id, message: message, path: "/collections/#{collection.address}", image_url: image_url })
  end

  def self.notify_nft_sold(collection, owner_id)
    return unless collection.present?
    message = I18n.t("notifications.nft_sold", collection_name: collection.title)
    image_url = collection_image_url(collection)
    create_notification({ to_user: owner_id, message: message, path: "/collections/#{collection.address}", image_url: image_url })
  end

  def self.notify_following(follow)
    return unless follow.present?
    user_name = follow.follower.name || follow.follower.address
    message = I18n.t('notifications.following', user_name: user_name)
    Rails.application.routes.default_url_options[:host] = Rails.application.credentials.config[:app_url] || 'localhost:3000'
    image_url = Rails.application.routes.url_helpers.url_for(follow.follower.profile_image(:icon))
    create_notification({
                          from_user: follow.follower_id,
                          to_user: follow.followee_id,
                          message: message,
                          path: "/users/#{follow.follower.address}",
                          image_url: image_url
                        })
  end

  def self.create_notification(param)
    create({
      from_user_id: param[:from_user],
      to_user_id: param[:to_user],
      message: param[:message],
      redirect_path: param[:path],
      image_url: param[:image_url]
    })
  end
end
