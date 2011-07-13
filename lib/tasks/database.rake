namespace :database do

  desc "Convert instances of the tracking parameter to info"
  task :tracking_to_info => :environment do
    Click.find_each( :conditions => ["url LIKE ? OR referrer LIKE ?", '%tracking=%', '%tracking=%']) do |click|
      click.url = click.url.gsub(/([?&])tracking=/, '\1info=')
      click.referrer = click.referrer.gsub(/([?&])tracking=/, '\1info=')
      click.save
    end
  end
end
