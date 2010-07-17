class ClearanceMailer < ActionMailer::Base

  def change_password(user, photocracy)
    default_url_options[:host] = (photocracy ? PHOTOCRACY_HOST : HOST)

    from       DO_NOT_REPLY
    recipients user.email
    subject    "Change your password"
    body       :user => user,
               :photocracy => photocracy
  end

  def confirmation(user, earl = 'http://www.allourideas.org', photocracy=false)
    default_url_options[:host] = (photocracy ? PHOTOCRACY_HOST : HOST)

    from       DO_NOT_REPLY
    bcc        SIGNUPS
    cc         SIGNUPS
    recipients user.email
    subject    "Account confirmation"
    body      :user => user, 
              :marketplace_url => earl,
              :photocracy => photocracy
  end

end
