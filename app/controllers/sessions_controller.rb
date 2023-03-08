class SessionsController < ApplicationController
  skip_before_action :authenticate_user, only: [:create, :valid_user]
  skip_before_action :is_approved

  def create
    destroy_session if ActiveModel::Type::Boolean.new.cast(params[:destroy_session])
    user = User.find_or_create_by(address: params[:address])
    session[:user_id] = user.id if user.present?
    session[:wallet] = params[:wallet]
    session[:balance] = params[:balance]
    render json: user.as_json, message: "Successfully Logged in"
  end

  def destroy
    destroy_session
    render json: {}, message: "Successfully Session destroyed"
  end

  def destroy_session
    cookies["_rarible_session"] = nil
    cookies.delete "_rarible_session"
    reset_session
  end

  def valid_user
    user = User.find_by_address(params[:address])
    render json: {user_exists: user.present?}, message: "Successfully validated"
  end
end
