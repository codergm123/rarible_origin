class DashboardController < ApplicationController
  skip_before_action :authenticate_user
  skip_before_action :is_approved

  def index
    set_categories_by_filter
    @likes = current_user ? current_user.likes.pluck(:collection_id) : []
    @hot_bids = Collection.top_bids(30).with_attached_attachment
    @featured_users = FeaturedUser.limit(5).map(&:user)
    @featured_collections = FeaturedCollection.limit(5).map(&:collection).compact
    # @hot_collections = Collection.group(:owner).count
    top_buyers_and_sellers
  end

  def set_categories_by_filter
    params[:page_no] ||= 1
    @category_collections = params[:query].present? ? Collection.search("*#{params[:query].strip}*").records : Collection
    @category_collections = @category_collections.get_with_sort_option(params[:sort_by])
    @category_collections = @category_collections.where("category like ?", "%#{params[:category]}%") if params[:category].present?
    @category_collections = @category_collections.with_attached_attachment.paginate(page: params[:page_no] || 1)
  end

  def top_buyers_and_sellers
    @top_sellers = User.top_seller(params[:days]).with_attached_attachment
    @top_buyers = User.top_buyer(params[:days]).with_attached_attachment
  end

  def search
    if params[:tab] =='users'
      @users = User.search("*#{params[:query]}*").records
    else
      params[:page_no] ||= 1
      @collections = params[:query].present? ? Collection.search("*#{params[:query].strip}*").records : Collection
      @collections= @collections.with_attached_attachment.paginate(page: params[:page_no] || 1)
    end
  end

  def notifications
    Notification.unread(current_user).update_all(is_read: true) if Notification.unread(current_user).present?
    @notifications = current_user.notifications
  end

  def contract_abi
    shared = ActiveModel::Type::Boolean.new.cast(params[:shared])
    abi = if params[:contract_address].present? && (params[:type] == 'erc20' || shared)
            { abi: Api::Etherscan.new.contract_abi(params[:contract_address]), bytecode: '' }
          elsif(!shared)
            if params[:type] == 'nft721'
              Utils::Abi.nft721
            elsif params[:type] == 'nft1155'
              Utils::Abi.nft1155
            end
          else
            {}
          end
    render json: {compiled_contract_details: abi}
  end
end
