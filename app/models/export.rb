class Export < ActiveRecord::Base
  def self.memory_safe_destroy(id)
    e = self.find(id).id
    e.destroy
  end
end
