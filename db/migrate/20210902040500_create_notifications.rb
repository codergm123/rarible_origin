class CreateNotifications < ActiveRecord::Migration[6.1]
  def change
    create_table :notifications do |t|
      t.references :from_user, foreign_key: { to_table: :users }
      t.references :to_user, foreign_key: { to_table: :users }
      t.text :message
      t.text :redirect_path
      t.boolean :is_read, default: false

      t.timestamps
    end
  end
end
