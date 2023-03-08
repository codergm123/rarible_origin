class Admin::DashboardController < Admin::BaseController
  def index
    @user_count = User.all.count
    @collection_count = Collection.all.count
  end
end
