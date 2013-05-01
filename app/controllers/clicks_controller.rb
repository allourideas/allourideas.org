class ClicksController < InheritedResources::Base
    
   def export
    @clicks = Click.find(:all, :include => :session_info)
    outfile = "clicks_" + Time.now.strftime("%m-%d-%Y") + ".csv"
    headers = ['Click ID', 'Session ID', 'User ID', 'Ip Addr', 'Controller', 'Action', 
	       'URL', 'Referrer', 'User Agent', 'Created at', 'Updated at']

    csv_data = CSVBridge.generate do |csv|
       csv << headers
       @clicks.each do |c|
               csv << [ c.id, c.session_info.session_id, c.user_id, c.session_info.ip_addr, c.controller, c.action, 
		       c.url, c.referrer, c.session_info.user_agent, c.created_at, c.updated_at]
       end
    end

    send_data(csv_data,
        :type => 'text/csv; charset=iso-8859-1; header=present',
      :disposition => "attachment; filename=#{outfile}")
   end
	
end
