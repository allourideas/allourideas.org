class User < ActiveRecord::Base
  include Clearance::User
  has_many :earls
  has_many :session_infos
  has_many :clicks
  attr_accessor :default
  before_validation :set_confirmed_email, on: create

  def owns?(earl)
    earl.user_id == id
  end

  def email_activated=(value)
      self.email_confirmed = value
  end

  def set_confirmed_email
      self.email_activated = true
  end

  def admin?
      self.admin
  end

end
