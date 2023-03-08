class StaticController < ApplicationController
  skip_before_action :authenticate_user
  skip_before_action :is_approved

  def about

  end

  def terms_conditions

  end

  def privacy

  end

  def faq

  end
end
