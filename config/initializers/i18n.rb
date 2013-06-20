I18n.backend.class.send(:include, I18n::Backend::Fallbacks)
I18n.backend.class.send(:include, I18n::Backend::Cache)
I18n.cache_store = ActiveSupport::Cache.lookup_store(:memory_store)
I18n.fallbacks.map('fr' => 'en')
