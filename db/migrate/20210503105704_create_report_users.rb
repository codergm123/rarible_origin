class CreateReportUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :report_users do |t|
      t.references :user, null: false, foreign_key: { to_table: :users }
      t.text :message
      t.references :created_by, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
