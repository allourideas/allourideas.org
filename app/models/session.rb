class Session < ActiveResource::Base
  self.site = ENV["API_HOST"]
  self.user = ENV["PAIRWISE_USERNAME"]
  self.password = ENV["PAIRWISE_PASSWORD"]
  self.element_name = "visitor"
  self.format = :json
end
