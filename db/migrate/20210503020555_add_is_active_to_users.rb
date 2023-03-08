class AddIsActiveToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :is_active, :boolean, default: true
    add_column :users, :is_approved, :boolean, default: false
  end
end
