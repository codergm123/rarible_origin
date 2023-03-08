class Admin::FeesController < Admin::BaseController
  before_action :set_fee, only: %i[ show edit update destroy ]

  def index
    @fees = Fee.unscoped.paginate(page: params[:page], per_page: 10)
  end

  def show
  end

  def new
    @fee = Fee.new
  end

  def edit
  end

  def create
    @fee = Fee.new(fee_params)

    respond_to do |format|
      if @fee.save
        format.html { redirect_to admin_fees_path, notice: "Fee was successfully created." }
        format.json { render :show, status: :created, location: new_admin_fee_path }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @fee.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @fee.update(fee_params)
        format.html { redirect_to admin_fees_path, notice: "Fee was successfully updated." }
        format.json { render :show, status: :ok, location: edit_admin_fee_path }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @fee.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @fee.destroy
    respond_to do |format|
      format.html { redirect_to admin_fees_url, notice: "Fee was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
  def set_fee
    @fee = Fee.unscoped.find(params[:id])
  end

  def fee_params
    params.require(:fee).permit(:name, :fee_type, :price, :percentage)
  end
end
