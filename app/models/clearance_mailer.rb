unless ["development", "test", "cucumber"].include? Rails.env
  include SendGrid
end

class ClearanceMailer < ActionMailer::Base
  def change_password(user, photocracy = false)
    default_url_options[:host] = (photocracy ? ENV["PHOTOCRACY_HOST"] : ENV["HOST"])

    from_address = photocracy ? ENV["INFO_PHOTOCRACY_EMAIL"] : ENV["INFO_ALLOURIDEAS_EMAIL"]

    from from_address
    recipients user.email
    subject "Change your password"
    body :user => user,
         :photocracy => photocracy
  end

  def confirmation(user, earl, photocracy = false)
    default_url_options[:host] = (photocracy ? ENV["PHOTOCRACY_HOST"] : ENV["HOST"])

    from_address = photocracy ? ENV["INFO_PHOTOCRACY_EMAIL"] : ENV["INFO_ALLOURIDEAS_EMAIL"]
    signup_address = photocracy ? [ENV["SIGNUPS_PHOTOCRACY_EMAIL"]] : [ENV["SIGNUPS_ALLOURIDEAS_EMAIL"]]

    from from_address
    bcc signup_address
    recipients user.email
    subject "Account confirmation"
    body :user => user,
         :earl => earl,
         :photocracy => photocracy
  end
end
