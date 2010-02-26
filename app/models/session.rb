class Session < ActiveResource::Base
  self.site = API_HOST
  self.user = PAIRWISE_USERNAME
  self.password = PAIRWISE_PASSWORD
  self.element_name = "visitor"

end
