class ReportUser < ApplicationRecord
  belongs_to :user
  belongs_to :created_by, class_name: 'User'
end
