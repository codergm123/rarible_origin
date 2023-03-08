class Admin::TransactionsController < Admin::BaseController
  def index
    @transactions = if params[:from_date].present? && params[:to_date].present?
      Transaction.where(created_at: params[:from_date].to_date..params[:to_date].to_date).paginate(page: params[:page])
    else
      Transaction.all.paginate(page: params[:page])
    end
    
    @transactions = @transactions.order("created_at #{params[:sort_by] == 'latest' ? 'desc' : 'asc'}") if params[:sort_by].present?
  end
end
