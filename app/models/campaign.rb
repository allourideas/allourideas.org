class Campaign < ActiveRecord::Base
  belongs_to :user
  #belongs_to :post, optional: true
  #belongs_to :group, optional: true
  #belongs_to :community, optional: true
  #belongs_to :domain, optional: true
  belongs_to :question, optional: true

  default_scope { where(deleted: false) }
end
