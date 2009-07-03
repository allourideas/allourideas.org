class ApplicationController < ActionController::Base
  include Clearance::Authentication
  include HoptoadNotifier::Catcher

  helper :all
  protect_from_forgery
end
