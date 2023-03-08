class AddImageUrlToNotifications < ActiveRecord::Migration[6.1]
  def change
    add_column :notifications, :image_url, :text
  end
end
