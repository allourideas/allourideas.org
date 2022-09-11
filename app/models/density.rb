class Density < ActiveResource::Base
  self.site = ENV["API_HOST"]
  self.user = ENV["PAIRWISE_USERNAME"]
  self.password = ENV["PAIRWISE_PASSWORD"]
end
