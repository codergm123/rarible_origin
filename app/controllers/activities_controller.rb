class ActivitiesController < ApplicationController
  skip_before_action :authenticate_user
  skip_before_action :is_approved

  def index
    load_activities
  end

  def load_activities
    @page_no = params[:page_no] || 1
    @activities = if current_user.present?
      if params[:activity_type] == "following"
        current_user.following_activities(params[:filters], @page_no)
      elsif params[:activity_type] == "activity"
        current_user.self_activities(params[:filters], @page_no)
      else
        current_user.all_activities(params[:filters], @page_no)
      end
    else
      filter = params[:filters] || []
      User.default_activities(filter, @page_no)
    end
  end

  def load_more
    load_activities
  end
end
