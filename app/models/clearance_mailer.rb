unless ["development", "test", "cucumber"].include? Rails.env
  include SendGrid
end

class ClearanceMailer < ActionMailer::Base
  def change_password(user, photocracy = false)
    default_url_options[:host] = (photocracy ? ENV["PHOTOCRACY_HOST"] : ENV["HOST"])

    from_address = photocracy ? ENV["INFO_PHOTOCRACY_EMAIL"] : ENV["INFO_ALLOURIDEAS_EMAIL"]

    mail(
      from: from_address,
      to: user.email,
      subject: "Change your password",
      body: render_to_string('change_password', :locals => { :user => user, :photocracy => photocracy })
    )
  end

  def confirmation(user, earl, photocracy = false)
    default_url_options[:host] = (photocracy ? ENV["PHOTOCRACY_HOST"] : ENV["HOST"])

    from_address = photocracy ? ENV["INFO_PHOTOCRACY_EMAIL"] : ENV["INFO_ALLOURIDEAS_EMAIL"]
    signup_address = photocracy ? [ENV["SIGNUPS_PHOTOCRACY_EMAIL"]] : [ENV["SIGNUPS_ALLOURIDEAS_EMAIL"]]

    mail(
      from: from_address,
      to: user.email,
      bcc: signup_address,
      subject: "Account confirmation",
      body: render_to_string('confirmation', :locals => { :user => user, :earl => earl, :photocracy => photocracy })
    )
  end
end
