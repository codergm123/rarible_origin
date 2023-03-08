class AddSignToBids < ActiveRecord::Migration[6.1]
  def change
    add_column :bids, :sigin, :string
  end
end
