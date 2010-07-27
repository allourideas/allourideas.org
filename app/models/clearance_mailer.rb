include SendGrid
class ClearanceMailer < ActionMailer::Base

  def change_password(user, photocracy)
    default_url_options[:host] = (photocracy ? PHOTOCRACY_HOST : HOST)

    from_address = photocracy ? "Photocracy Support <info@photocracy.org>" : "AllOurIdeas Support <info@allourideas.org>"

    from       from_address
    recipients user.email
    subject    "Change your password"
    body       :user => user,
               :photocracy => photocracy
  end

  def confirmation(user, earl_name='http://www.allourideas.org', photocracy=false)
    default_url_options[:host] = (photocracy ? PHOTOCRACY_HOST : HOST)

    from_address = photocracy ? "Photocracy Support <info@photocracy.org>" : "AllOurIdeas Support <info@allourideas.org>"

    from       from_address
    bcc        SIGNUPS
    cc         SIGNUPS
    recipients user.email
    subject    "Account confirmation"
    body      :user => user, 
              :earl_name => earl_name,
              :photocracy => photocracy
  end

end
