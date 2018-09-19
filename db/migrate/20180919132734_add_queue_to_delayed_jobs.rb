class AddQueueToDelayedJobs < ActiveRecord::Migration[5.2]
  def change
    add_column :delayed_jobs, :queue, :string
  end
end
