class Admin::FeaturedCollectionsController < Admin::BaseController
  before_action :is_maxed_out, only: :new

  def index
    @featured_collections = FeaturedCollection.paginate(page: params[:page], per_page: 10)
  end

  def show
    @collection = Collection.find_by_address(params[:id])
    @errors = ["Given NFT ID is invalid"] unless @collection.present? 
  end

  def new
  end

  def create
    if featured_collection_params[:collection_id].present?
      featured_collection_params[:collection_id].split(",").each do |collection_id|
        FeaturedCollection.find_or_create_by(collection_id: collection_id)
      end
    else
      @errors = ["NFT ID must present"]
    end
  end

  def destroy
    featured_collection = FeaturedCollection.find(params[:id])
    featured_collection.destroy

    respond_to do |format|
      format.html { redirect_to admin_featured_collections_url, notice: "Featured Collection was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def featured_collection_params
    params.require(:featured_collection).permit(:collection_id)
  end

  def is_maxed_out
    @featured_collections = FeaturedCollection.all
    if @featured_collections.count >= 5
      redirect_to admin_featured_collections_url, alert: "Already created 5 featured collections. Please destroy some to create new"
    end
  end
end
