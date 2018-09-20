class Session < ActiveResource::Base
  self.element_name = "visitor"
  self.format = :json
end
