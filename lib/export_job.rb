class ExportJob < Struct.new(:earl_id, :type, :email, :photocracy)

  def on_permanent_failure
    IdeaMailer.deliver_export_failed(['errors@allourideas.org', email], photocracy)
  end

  # Triggers pairwise export of CSV
  # also inserts new delayed_job for munge_and_notify
  # We separate export and munge_and_notify so that the call to trigger 
  # export in pairwise doesn't happen again if something later on (now
  # munge_and_notify) fails.
  def perform
    SiteConfig.set_pairwise_credentials(photocracy)

    earl = Earl.find(earl_id)
    question = Question.find(earl.question_id)

    redis_key  = "export_#{earl.question_id}_#{type}_#{Time.now.to_i}"
    redis_key += "_#{Digest::SHA1.hexdigest(redis_key + rand(10000000).to_s)}"

    question.post(:export, :type => type, :response_type => 'redis', :redis_key => redis_key)

    Delayed::Job.enqueue MungeAndNotifyJob.new(earl_id, type, email, photocracy, redis_key), Delayed::Worker.default_priority, 5.minutes.from_now
  end

end
