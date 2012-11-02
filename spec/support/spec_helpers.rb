module SpecHelper
  def sign_in_as(user)
    @controller.current_user = user
  end
  def sign_out
    @controller.current_user = nil
  end

  def capybara_sign_in_as(user)
    visit new_session_path
    within('.body form') do
      fill_in "Email", :with => user.email
      fill_in "Password", :with => user.password
      click_button "Log In"
    end
    page.should have_content("Signed in.")
    page.should have_content(user.email)
  end
end
