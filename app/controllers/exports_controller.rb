class ExportsController < ApplicationController

  def download
    e = Export.find_by(name: params[:name].to_s)
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
    # strip off 4 character random string at end of name
    filename = e.name.gsub(/_[A-Za-z]{4}$/, "") + ".csv"
    send_data(data, :type => 'text/csv; charset=utf-8; header=present', :filename => filename)
  end

end
