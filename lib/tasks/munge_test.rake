namespace :munge_test do
  # expects a CSV file to open that is the result of the Pairwise CSV
  # generation process. Runs MungeAndNotify 
  # useful for testing large CSV files
  desc "test CSV with large data"
  task :large_data => :environment do
    file = File.open("861_votes.csv", "rb")
    #file = File.open("861_votes-head.csv", "rb")
    csv_data = file.read
    zlib = Zlib::Deflate.new
    zlibcsv = zlib.deflate(csv_data, Zlib::FINISH)
    zlib.close

    redis = Redis.new(:host => REDIS_CONFIG['hostname'])
    redis.lpush('large_data_test', zlibcsv)
  
    job = MungeAndNotifyJob.new(836, 'votes', 'noreply@allourideas.org', false, 'large_data_test')
    job.perform
  end
end
