class Admin::BaseController < ApplicationController
  layout 'admin'
  skip_before_action :authenticate_user
  skip_before_action :is_approved
  before_action :authenticate_admin_admin_user!

  def after_sign_in_path_for
    admin_dashboard_path
  end
end
