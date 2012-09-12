class Density < ActiveResource::Base
  self.site = APP_CONFIG[:API_HOST]
  self.user = APP_CONFIG[:PAIRWISE_USERNAME]
  self.password = APP_CONFIG[:PAIRWISE_PASSWORD]
end
