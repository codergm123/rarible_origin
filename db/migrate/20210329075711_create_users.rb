class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :address
      t.boolean :is_verified
      t.string :name
      t.text :bio
      t.string :twitter_link
      t.string :personal_url

      t.timestamps
    end
  end
end
