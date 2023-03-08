class AddOwnerColumnToBids < ActiveRecord::Migration[6.1]
  def change
    add_column :bids, :owner_id, :integer
  end
end
