unless ["development", "test", "cucumber"].include? Rails.env
   include SendGrid
end
class ClearanceMailer < ActionMailer::Base

  def change_password(user, photocracy=false)
    default_url_options[:host] = (photocracy ? APP_CONFIG[:PHOTOCRACY_HOST] : APP_CONFIG[:HOST])

    from_address = photocracy ? APP_CONFIG[:INFO_PHOTOCRACY_EMAIL] : APP_CONFIG[:INFO_ALLOURIDEAS_EMAIL]

    from       from_address
    recipients user.email
    subject    "Change your password"
    body       :user => user,
               :photocracy => photocracy
  end

  def confirmation(user, earl_name='http://www.allourideas.org', photocracy=false)
    default_url_options[:host] = (photocracy ? APP_CONFIG[:PHOTOCRACY_HOST] : APP_CONFIG[:HOST])

    from_address = photocracy ? APP_CONFIG[:INFO_PHOTOCRACY_EMAIL] : APP_CONFIG[:INFO_ALLOURIDEAS_EMAIL]
    signup_address = photocracy ? [APP_CONFIG[:SIGNUPS_PHOTOCRACY_EMAIL]] : [APP_CONFIG[:SIGNUPS_ALLOURIDEAS_EMAIL]]

    from       from_address
    bcc        signup_address
    recipients user.email
    subject    "Account confirmation"
    body      :user => user, 
              :earl_name => earl_name,
              :photocracy => photocracy
  end

end
