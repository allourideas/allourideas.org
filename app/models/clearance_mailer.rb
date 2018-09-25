unless ["development", "test", "cucumber"].include? Rails.env
   include SendGrid
end
class ClearanceMailer < ActionMailer::Base

  def change_password(user, photocracy=false)
    default_url_options[:host] = (photocracy ? APP_CONFIG[:PHOTOCRACY_HOST] : APP_CONFIG[:HOST])

    from_address = photocracy ? APP_CONFIG[:INFO_PHOTOCRACY_EMAIL] : APP_CONFIG[:INFO_ALLOURIDEAS_EMAIL]

    @user = user
    @photocracy = photocracy
    mail(
      from: from_address,
      to: user.email,
      subject: "Change your password"
    )
  end

  def confirmation(user, earl, photocracy=false)
    default_url_options[:host] = (photocracy ? APP_CONFIG[:PHOTOCRACY_HOST] : APP_CONFIG[:HOST])

    from_address = photocracy ? APP_CONFIG[:INFO_PHOTOCRACY_EMAIL] : APP_CONFIG[:INFO_ALLOURIDEAS_EMAIL]
    signup_address = photocracy ? [APP_CONFIG[:SIGNUPS_PHOTOCRACY_EMAIL]] : [APP_CONFIG[:SIGNUPS_ALLOURIDEAS_EMAIL]]

    @user = user
    @earl = earl
    @photocracy = photocracy
    mail(
      from: from_address,
      to: user.email,
      bcc: signup_address,
      subject: "Account confirmation"
    )
  end

end
