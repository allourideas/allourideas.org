ActiveResource::Base.site = APP_CONFIG[:API_HOST]
ActiveResource::Base.user = APP_CONFIG[:PAIRWISE_USERNAME]
ActiveResource::Base.password = APP_CONFIG[:PAIRWISE_PASSWORD]
ActiveResource::Base.format = :xml

