class Admin::FeaturedUsersController < Admin::BaseController
  before_action :is_maxed_out, only: :new

  def index
    @featured_users = FeaturedUser.paginate(page: params[:page], per_page: 10)
  end

  def show
    @user = User.find_by_address(params[:id])
    @errors = ["Given User ID is invalid"] unless @user.present? 
    # data = user.present? ? {name: user.name, img: user.profile_image} : {}
    # render json: {data: data} 
  end

  def new
  end

  def create
    @featured_user = FeaturedUser.new(featured_user_params)

    if featured_user_params[:user_id].present?
      featured_user_params[:user_id].split(",").each do |user_id|
        FeaturedUser.find_or_create_by(user_id: user_id)
      end
    else
      @errors = ["User ID must present"]
    end

    if @featured_user.valid?
    else
    end
  end

  def destroy
    featured_user = FeaturedUser.find(params[:id])
    featured_user.destroy

    respond_to do |format|
      format.html { redirect_to admin_featured_users_url, notice: "Featured User was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def featured_user_params
    params.require(:featured_user).permit(:user_id)
  end

  def is_maxed_out
    @featured_users = FeaturedUser.all
    if @featured_users.count >= 5
      redirect_to admin_featured_users_url, alert: "Already created 5 featured users. Please destroy some to create new"
    end
  end
end
