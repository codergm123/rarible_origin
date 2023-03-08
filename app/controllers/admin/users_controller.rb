class Admin::UsersController < Admin::BaseController
  before_action :set_user, except: [:index, :new, :create]

  def index
    @users = if params[:name].present?
      User.where("name like ?", "%#{params[:name]}%").paginate(page: params[:page])
    else
      User.order(id: :desc).paginate(page: params[:page], per_page: 10)
    end
  end

  def new
    @user = User.new
  end

  def show
  end

  def edit
  end

  def create
  end

  def update
    @user.assign_attributes(user_params)
    if @user.valid?
      @user.save
      redirect_to admin_users_path
    else
      render action: 'edit'
    end
  end

  def destroy
    @user.update(is_active: false)
    @user.collections.update_all(is_active: false)
    respond_to do |format|
      format.html { redirect_to admin_users_path, notice: "User was successfully blocked." }
      format.json { head :no_content }
    end
  end

  def collections
    @collections = Collection.where("creator_id=? or owner_id=?", @user.id, @user.id)
  end

  def approve
    @user.update(is_approved: true)
    Notification.notify_profile_verified(@user)
    respond_to do |format|
      format.html { redirect_to admin_users_path, notice: "User was successfully approved." }
      format.json { head :no_content }
    end
  end

  def deny
    @user.update(is_approved: false)
    respond_to do |format|
      format.html { redirect_to admin_users_path, notice: "User was successfully denied." }
      format.json { head :no_content }
    end
  end

  def verify
    @user.update(is_verified: true)
    respond_to do |format|
      format.html { redirect_to admin_users_path, notice: "User was successfully verified." }
      format.json { head :no_content }
    end
  end

  def enable
    @user.update(is_active: true)
    Collection.unscoped.where(owner_id: @user.id).update_all(is_active: true)
    respond_to do |format|
      format.html { redirect_to admin_users_path, notice: "User was successfully enabled." }
      format.json { head :no_content }
    end
  end

  def reports
    @reports = ReportUser.order(created_at: :desc).paginate(page: params[:page], per_page: 10)
  end

  private

  def user_params
    params.require(:user).permit(:name, :bio, :twitter_link, :personal_url)
  end

  def set_user
    @user = User.find_by(id: params[:id])
  end
end
