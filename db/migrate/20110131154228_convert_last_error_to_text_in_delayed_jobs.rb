class ConvertLastErrorToTextInDelayedJobs < ActiveRecord::Migration
  def self.up
    change_column(:delayed_jobs, :last_error, :text)
    add_index :delayed_jobs, [:priority, :run_at], :name => 'delayed_jobs_priority'
  end

  def self.down
    change_column(:delayed_jobs, :last_error, :string)
    remove_index :delayed_jobs, :name => :delayed_jobs_priority
  end
end
