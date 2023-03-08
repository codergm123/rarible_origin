class AddOwnedTokensToCollections < ActiveRecord::Migration[6.1]
  def change
    add_column :collections, :owned_tokens, :integer
  end
end
