class ExportsController < ApplicationController

  def download
    e = Export.find_by_name(params[:name])
    if e.nil?
      redirect_to '/' and return
    end
    send_data(e.data, :type => 'text/csv; charset=utf-8; header=present', :filename => "#{e.name}.csv")
  end

end
