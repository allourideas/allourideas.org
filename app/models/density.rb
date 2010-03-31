class Density < ActiveResource::Base
  self.site = API_HOST
  self.user = PAIRWISE_USERNAME
  self.password = PAIRWISE_PASSWORD
end
