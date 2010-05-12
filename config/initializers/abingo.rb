require 'redis-store'
Abingo.cache = ActiveSupport::Cache::RedisStore.new
