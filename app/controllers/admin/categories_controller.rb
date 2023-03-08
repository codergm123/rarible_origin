class Admin::CategoriesController < Admin::BaseController
  before_action :set_category, only: %i[ show edit update destroy ]

  def index
    @categories = Category.unscoped.paginate(page: params[:page], per_page: 10)
  end

  def show
  end

  def new
    @category = Category.new
  end

  def edit
  end

  def create
    @category = Category.new(category_params)

    respond_to do |format|
      if @category.save
        format.html { redirect_to admin_categories_path, notice: "Category was successfully created." }
        format.json { render :show, status: :created, location: new_admin_category_path }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @category.update(category_params)
        format.html { redirect_to admin_categories_path, notice: "Category was successfully updated." }
        format.json { render :show, status: :ok, location: edit_admin_category_path }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @category.update(is_active: false)
    respond_to do |format|
      format.html { redirect_to admin_categories_path, notice: "Category was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    def set_category
      @category = Category.unscoped.find(params[:id])
    end

    def category_params
      params.require(:category).permit(:name, :is_active)
    end
end
