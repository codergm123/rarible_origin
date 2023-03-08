class AddTokenToCollections < ActiveRecord::Migration[6.1]
  def change
    add_column :collections, :token, :string, unique: true
  end
end
