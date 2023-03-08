class Category < ApplicationRecord
  default_scope -> { where(is_active: true) } 
end
