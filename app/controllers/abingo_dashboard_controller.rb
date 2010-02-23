class AbingoDashboardController < ApplicationController
	before_filter :admin_only
	include Abingo::Controller::Dashboard
end

