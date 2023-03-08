class ApplicationController < ActionController::Base
  prepend_before_action :authenticate_user
  before_action :is_approved
  before_action :set_locale
  before_action :set_base_gon
  # before_action :authenticate_user, except: [:show]

  helper_method :current_user, :current_balance, :service_fee, :gon



  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def current_balance
    @current_balance ||= session[:balance]
  end

  def service_fee
    Fee.default_service_fee
  end

  def set_locale
    if params[:locale] || cookies['locale'].nil?
      I18n.locale = params[:locale] || I18n.default_locale
      cookies['locale'] = I18n.locale
    else
      I18n.locale = cookies['locale']
    end
    @locale = I18n.locale 
  end

  def authenticate_user
    redirect_to root_path, alert: 'Please connect your wallet to proceed.' unless current_user
  end

  def is_approved
    redirect_to root_path, alert: 'Pending for admin approval.' unless current_user&.is_approved
  end

  def set_base_gon
    gon.session = current_user.present?
  end

end
