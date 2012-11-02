module SpecHelper
  def sign_in_as(user)
    @controller.current_user = user
  end
  def sign_out
    @controller.current_user = nil
  end
end
