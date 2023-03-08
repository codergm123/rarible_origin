class User < ApplicationRecord
  include Searchable

  ACTIVITY_FILTERS = ["minted", "following", "like", "bid"].freeze
  IMAGE_SIZE = {icon:  {resize: "50x50"}, thumb: {resize: "100x100"}, banner: {resize: "400x400"}}
  self.per_page = 5

  has_many :collections, foreign_key: "owner_id"
  has_many :created_collections, foreign_key: "creator_id", class_name: "Collection"
  has_many :follows, dependent: :destroy
  has_many :followed_users, foreign_key: :follower_id, class_name: 'Follow'
  has_many :followees, through: :followed_users
  has_many :following_users, foreign_key: :followee_id, class_name: 'Follow'
  has_many :followers, through: :following_users
  has_many :likes, dependent: :destroy
  has_many :bids
  has_many :owner_bids, foreign_key: "owner_id", class_name: "Bid"
  has_many :reports, foreign_key: "user_id", class_name: "ReportUser"
  has_many :reported, foreign_key: "created_by", class_name: "ReportUser"
  has_many :nft_contracts, foreign_key: "owner_id"
  has_many :sellings, foreign_key: "seller_id", class_name: "Transaction"
  has_many :buyings, foreign_key: "buyer_id", class_name: "Transaction"
  has_many :notifications, foreign_key: "to_user_id"

  has_one_attached :attachment
  has_one_attached :banner

  has_paper_trail

  before_create :set_approved

  settings number_of_shards:1 do
    mapping dynamic:'false' do
      #indexes :id, type: :index
      # indexes :name
    end
  end

  scope :active, lambda { where(is_active: true) }
  scope :top_seller, lambda { |days|
                                days ||=30
                                # seller_ids = Transaction.where('created_at >=?',days.to_i.days.ago).group('seller_id').order('count(seller_id) desc').pluck(:seller_id)
                                ids = Transaction.where('created_at >=?', days.to_i.days.ago)
                                if ids.blank?
                                  User.order('RAND()').limit(8)
                                else
                                  seller_ids = ids.group_by { |t| t.seller_id }.map { |user_id, transactions|  [user_id, transactions.map(&:currency).map(&:to_f).sum] }.sort_by { |user_id, total| total }.reverse.map{ |user_id, total| user_id }
                                  where(id: seller_ids).includes(:sellings).order(Arel.sql("field(id, #{seller_ids.join(',')})"))
                                end
                            }
  scope :top_buyer, lambda { |days|
                                days ||=30
                                # buyer_ids = Transaction.where('created_at >=?',days.to_i.days.ago).group('buyer_id').order('count(buyer_id) desc').pluck(:buyer_id)
                                ids = Transaction.where('created_at >=?', days.to_i.days.ago)
                                if ids.blank?
                                  User.order('RAND()').limit(8)
                                else
                                  buyer_ids = ids.group_by { |t| t.buyer_id }.map { |user_id, transactions|  [user_id, transactions.map(&:currency).map(&:to_f).sum] }.sort_by { |user_id, total| total }.reverse.map{ |user_id, total| user_id }
                                  where(id: buyer_ids).includes(:buyings).order(Arel.sql("field(id, #{buyer_ids.join(',')})"))
                                end
                            }

  def self.default_image
    '/assets/default_user.png'
  end

  def profile_image(size = nil)
    if attachment.attached?
      attachment_with_variant(size)
    else
      'default_user.png'
    end
  end

  def banner_image
    if banner.attached?
      banner
    else
      'banner-bg.jpeg'
    end
  end

  def cntnt_placeholder_img
      'dummy-image.jpg'
  end

  def full_name
    name.present? ? name : masked_address(8)
  end

  def total_transaction(is_buy=false)
    transactions = is_buy ? buyings : sellings
    [transactions.map(&:currency).map(&:to_f).sum, Rails.application.credentials.config[:base_coin]].join(' ')
  end

  def like_collection(hash)
    #We might need to check the collection present or not.
    like = self.likes.create(collection_id: hash[:collection_id])
    like.valid?
  end

  def unlike_collection(hash)
    like = self.likes.where(collection_id: hash[:collection_id]).first
    like.destroy if like.present?
    # like.destroyed?
  end

  def all_activities(filters, page_no=1)
    follow_ids = Follow.where(follower_id: id).pluck(:id)
    collection_ids = collections.pluck(:id)
    like_ids = likes.pluck(:id)
    bid_ids = bids.pluck(:id)

    followee_ids = followees.pluck(:id)
    collection_ids << Collection.where("owner_id in (?)", followee_ids).pluck(:id)
    like_ids << Like.where("user_id in (?)", followee_ids).pluck(:id)
    follow_ids << Follow.where(follower_id: followee_ids).pluck(:id)
    bid_ids << Bid.where("user_id in (?)", followee_ids).pluck(:id)

    query_params = build_query_params(filters, collection_ids.flatten.uniq, like_ids.flatten.uniq, follow_ids.flatten.uniq, bid_ids.flatten.uniq)
    activities(query_params, page_no)
  end

  def self_activities(filters, page_no=1)
    follow_ids = Follow.where(follower_id: id).pluck(:id)
    # query_params = build_query_params(filters, collections.pluck(:id), likes.pluck(:id), follow_ids, bids.pluck(:id))
    query_params = build_query_params(filters, collections.pluck(:id), likes.pluck(:id), follow_ids, bids.pluck(:id))
    activities(query_params, page_no)
  end

  def following_activities(filters, page_no=1)
    followee_ids = followees.pluck(:id)
    collection_ids = Collection.where("owner_id in (?)", followee_ids).pluck(:id)
    like_ids = Like.where("user_id in (?)", followee_ids).pluck(:id)
    follow_ids = Follow.where(follower_id: followee_ids).pluck(:id)
    bid_ids = Bid.where("user_id in (?)", followee_ids).pluck(:id)

    query_params = build_query_params(filters, collection_ids, like_ids, follow_ids, bid_ids)
    activities(query_params, page_no)
  end

  def build_query_params(filters, collection_ids, like_ids, follow_ids, bid_ids, user_ids=[])
    query_params = []

    if filters.present?
      filters.each do |f|
        case f
        # when "minted"
        #   query_params["Collection"] = collection_ids if ACTIVITY_FILTERS.include?(f)
        # when "following"
        #   query_params["Follow"] = follow_ids if ACTIVITY_FILTERS.include?(f)
        # when "like"
        #   query_params["Like"] = like_ids if ACTIVITY_FILTERS.include?(f)
        # when "bid"
        #   query_params["Bid"] = bid_ids if ACTIVITY_FILTERS.include?(f)
        # end
        when "minted"
          # query_params << ["Collection", collection_ids] if ACTIVITY_FILTERS.include?(f)
          query_params << "(item_type='Collection' and event='create' and item_id in (#{collection_ids.join(',')}))" if collection_ids.present? && ACTIVITY_FILTERS.include?(f)
        when "following"
          query_params << ["Follow", follow_ids] if follow_ids.present? && ACTIVITY_FILTERS.include?(f)
        when "like"
          query_params << ["Like", like_ids] if like_ids.present? && ACTIVITY_FILTERS.include?(f)
        when "bid"
          query_params << ["Bid", bid_ids] if bid_ids.present? && ACTIVITY_FILTERS.include?(f)
        when "transfers"
          query_params << "(object_changes like '%owner_id%' and event='update')"
        when "burns"
          query_params << "(object_changes like '%state:\n- 2\n- 3%' and event='update')"
        end
      end
    else
      query_params << ["Collection", collection_ids] if collection_ids.present?
      query_params << ["Like", like_ids] if like_ids.present?
      query_params << ["Follow", follow_ids] if follow_ids.present?
      query_params << ["Bid", bid_ids] if bid_ids.present?
      query_params << ["User", user_ids] if user_ids.present?
    end
    query_params
  end

  def activities(query_params, page_no=1)
    return [] unless query_params.present?
    wher_query = ''
    # if query_params.keys.present?
    #   wher_query = "("
    #   query_params.keys.each_with_index { |k, i| wher_query << "#{' OR ' if i != 0}(item_id IN (?) AND item_type = ?)#{ ')' if query_params.keys.length-1 == i}" }
    #   wher_params = [wher_query]
    #   query_params.each { |k, v| wher_params << v; wher_params << k.to_s }
    # end
    if query_params.present?
      query_params.each_with_index do |query, i|
        if query.kind_of?(Array) and query.last.present?
          wher_query << "#{' OR ' if i != 0}(item_id IN (#{query.last.join(',')}) AND item_type = '#{query.first}')#{ ')' if query_params.length-1 == i}"
        elsif query.kind_of?(String)
          wher_query << "#{' OR ' if i != 0}(#{query})#{ ')' if query_params.length-1 == i}"
        end
      end
    end
    wher_query = "(" +  wher_query if wher_query.present?


    reject_ids = PaperTrail::Version.where("event=? and object_changes is null", "update").pluck(:id)
    items = PaperTrail::Version.where(wher_query)
    items = items.where("id not in (?)", reject_ids)
    items = items.includes(item: [
      collection: [attachment_attachment: :blob],
      user: [attachment_attachment: :blob],
      follower: [attachment_attachment: :blob],
      followee: [attachment_attachment: :blob]
    ]).order(created_at: :desc).paginate(page: page_no, per_page: 50)
  end

  def self.default_activities(filters, page_no = 1)
    modified_filters = []
    reject_ids = PaperTrail::Version.where("event=? and object_changes is null", "update").pluck(:id)
    items = PaperTrail::Version
    items = items.where("id not in (?)", reject_ids)
    query_params = []

    filters.each do |f|
      case f
      when "minted"
        modified_filters << "Collection"
        query_params << "(event='create')"
      when "transfers"
        query_params << "(object_changes like '%owner_id%' and event='update')"
      when "burns"
        query_params << "(object_changes like '%state:\n- 2\n- 3%' and event='update')"
      when "following"
        modified_filters << "Follow"
      when "like"
        modified_filters << "Like"
      when "bid"
        modified_filters << "Bid"
      end
    end

    items = items.where("item_type in (?)", modified_filters) if modified_filters.length > 0

    if query_params.present?
      wher_query = "("
      query_params.each_with_index { |k, i| wher_query << "#{' OR ' if i != 0}#{k}#{ ')' if query_params.length-1 == i}" }
      items = items.where(wher_query)
    end

    items.includes(item: [
      collection: [attachment_attachment: :blob],
      user: [attachment_attachment: :blob],
      follower: [attachment_attachment: :blob],
      followee: [attachment_attachment: :blob]
    ]).order(created_at: :desc).paginate(page: page_no, per_page: 50)
  end

  def notifications_activities
    followee_ids = followees.pluck(:id)
    like_ids = Like.where("user_id in (?)", followee_ids).pluck(:id)
    follow_ids = Follow.where(follower_id: followee_ids).pluck(:id)
    bid_ids = [owner_bids.pluck(:id), bids.pluck(:id)].flatten.uniq
    collection_ids = Collection.where("owner_id in (?)", followee_ids).pluck(:id)

    query_params = build_query_params([], collection_ids, like_ids, follow_ids, bid_ids, [id])
    activities(query_params)
  end

  def masked_address(first_char=13, last_char=4)
    "#{address[0..first_char]}...#{address.split(//).last(last_char).join("").to_s}"
  end

  def get_collections(tab, filters, page_no)
    case tab
    when "collectibles"
      Collection.where("owner_id=?", id).includes(attachment_attachment: :blob, creator: { attachment_attachment: :blob }, owner: { attachment_attachment: :blob }).paginate(page: page_no)
    when "created"
      Collection.by_creator(self).includes(attachment_attachment: :blob, creator: { attachment_attachment: :blob }, owner: { attachment_attachment: :blob }).paginate(page: page_no)
    when "liked"
      likes.paginate(page: page_no)
    when "activity"
      self_activities(filters,page_no)#.paginate(page: page_no)
    when "following"
      followees.includes(attachment_attachment: :blob).paginate(page: page_no)
    when "followers"
      followers.includes(attachment_attachment: :blob).paginate(page: page_no)
    else
      Collection.where("owner_id=? and put_on_sale=?", id, true).includes(attachment_attachment: :blob, creator: { attachment_attachment: :blob }, owner: { attachment_attachment: :blob }).paginate(page: page_no)
    end
  end

  def self.validate_user address
    where(address: address).first
  end

  def attachment_with_variant(size = nil)
    size.present? && IMAGE_SIZE[size].present? && attachment.content_type != "image/gif" ? attachment.variant(IMAGE_SIZE[size]) : attachment
  end

  private

  def set_approved
    self.is_approved = Rails.application.credentials.config[:auto_approval] ? Rails.application.credentials.config[:auto_approval] : false
  end
end
