namespace :munge_test do
  task :specific_job => :environment do
    job = Delayed::Job.find ENV['job_id']
    job.invoke_job
  end

  # expects a CSV file to open that is the result of the Pairwise CSV
  # generation process. Runs MungeAndNotify 
  # useful for testing large CSV files
  desc "test CSV with large data"
  task :large_data => :environment do
    earl_id = 836
    type = 'votes'
    email = 'noreply@allourideas.org'
    photocracy = false
    redis_key = 'large_data_test'

    file = File.open("861_votes.csv", "rb")
    #file = File.open("861_votes-head.csv", "rb")
    csv_data = file.read
    zlib = Zlib::Deflate.new
    zlibcsv = zlib.deflate(csv_data, Zlib::FINISH)
    zlib.close

    redis = Redis.new(:host => REDIS_CONFIG['hostname'])
    redis.lpush(redis_key, zlibcsv)
  
    Delayed::Job.enqueue MungeAndNotifyJob.new(earl_id, type, email, photocracy, redis_key), 15
    #job = MungeAndNotifyJob.new(earl_id, type, email, photocracy, redis_key)
    #job.perform
  end
end
