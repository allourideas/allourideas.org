class ClicksController < InheritedResources::Base
   require 'fastercsv'
    
   def export
    @clicks = Click.find(:all)
    outfile = "clicks_" + Time.now.strftime("%m-%d-%Y") + ".csv"
    headers = ['Click ID', 'Session ID', 'User ID', 'Ip Addr', 'Controller', 'Action', 'URL', 'Referrer', 'User Agent',
                'Created at', 'Updated at']

    csv_data = FasterCSV.generate do |csv|
       csv << headers
       @clicks.each do |c|
               csv << [ c.id, c.sid, c.user_id, c.ip_addr, c.controller, c.action, c.url, c.referrer, c.user_agent,
                       c.created_at, c.updated_at]
       end
    end

    send_data(csv_data,
        :type => 'text/csv; charset=iso-8859-1; header=present',
      :disposition => "attachment; filename=#{outfile}")
   end
	
end
