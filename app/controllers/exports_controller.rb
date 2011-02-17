class ExportsController < ApplicationController

  def download
    e = Export.find_by_name(params[:name])
    if e.nil? || e.data.nil? || e.compressed.nil?
      redirect_to '/' and return
    end
    if e.compressed?
      zstream = Zlib::Inflate.new
      data = zstream.inflate(e.data)
      zstream.finish
      zstream.close
    else
      data = e.data
    end
    send_data(data, :type => 'text/csv; charset=utf-8; header=present', :filename => "#{e.name}.csv")
  end

end
