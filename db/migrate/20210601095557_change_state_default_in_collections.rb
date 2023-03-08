class ChangeStateDefaultInCollections < ActiveRecord::Migration[6.1]
  def change
    change_column_default :collections, :state, nil
  end
end
