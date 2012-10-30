require 'redis-store'
Abingo.cache = ActiveSupport::Cache::RedisStore.new "redis://#{REDIS_CONFIG['hostname']}"
