unless Rails.env == "development"
   include SendGrid
end
class IdeaMailer < ActionMailer::Base

  default_url_options[:host] = HOST

  def notification(earl, question_name, choice_text, choice_id, photocracy=false)
    setup_email(earl.user, photocracy)

    @subject += "#{photocracy ? 'photo' : 'idea'} added to question: #{question_name}"
    @body[:question_name] = question_name
    @body[:earl] = earl
    @body[:choice_text] = choice_text
    @body[:choice_id] = choice_id
    @body[:choice_url] = get_choice_url(earl.name, choice_id, photocracy, true)
    @body[:photocracy] = photocracy
    @body[:object_type] = photocracy ? I18n.t('common.photo') : I18n.t('common.idea')

  end
  
  def notification_for_active(earl, question_name, choice_text, choice_id, photocracy=false)
    setup_email(earl.user, photocracy)
    @subject += "#{photocracy ? 'photo' : 'idea'} added to question: #{question_name}"
    @body[:question_name] = question_name
    @body[:earl] = earl
    @body[:choice_text] = choice_text
    @body[:choice_id] = choice_id
    @body[:choice_url] = get_choice_url(earl.name, choice_id, photocracy, false)
    @body[:photocracy] = photocracy
    @body[:object_type] = photocracy ? I18n.t('common.photo') : I18n.t('common.idea')
  end

  def flag_notification(earl, choice_id, choice_data, explanation, photocracy=false)
    setup_email(earl.user, photocracy)
    @subject += "Possible inappropriate #{photocracy ? 'photo' : 'idea'} flagged by user"
    @body[:earl] = earl
    @body[:choice_id] = choice_id
    @body[:choice_data] = choice_data
    @body[:explanation] = explanation
    @body[:photocracy] = photocracy
  end
  
  def extra_information(user, question_name, information, photocracy=false)
    @recipients  = "signups@allourideas.org"
    @from        = "info@allourideas.org"
    @subject     = photocracy ? "[Photocracy] " : "[All Our Ideas] "
    @sent_on     = Time.now
    @body[:user] = user
    @body[:host] = photocracy ? "www.photocracy.org" : "www.allourideas.org"
    @body[:photocracy] = photocracy

    @subject += "Extra Information included in #{question_name}"

    @body[:question_name] = question_name
    @body[:information] = information
  end

  def export_data_ready(email, link, photocracy=false)
     setup_email(nil, photocracy)
     @recipients  = email
     @subject += "Data export ready"
     @body[:url] = link
     @body[:photocracy] = photocracy
  end
  
  protected
    def setup_email(user, photocracy=false)
      if user
        @recipients  = user.email
      end
      @from        = photocracy ? "info@photocracy.org" : "info@allourideas.org"
      @subject     = photocracy ? "[Photocracy] " : "[All Our Ideas] "
      @sent_on     = Time.now
      @body[:user] = user
      @body[:host] = "www.#{photocracy ? 'photocracy' : 'allourideas'}.org"

    end

    def get_choice_url(earl_name, choice_id, photocracy, activate)
       url_options = {:question_id => earl_name, :id => choice_id}
       url_options.merge!(:photocracy_mode => true) if photocracy && Rails.env == "cucumber"
       url_options.merge!(:login_reminder => true) if photocracy

       if photocracy
           choice_path = question_choice_path(url_options)
       elsif activate
           choice_path = activate_question_choice_path(url_options)
       else
           choice_path = deactivate_question_choice_path(url_options)
       end

       if photocracy
	       choice_url = "http://#{PHOTOCRACY_HOST}#{choice_path}"
       else
	       choice_url = "http://#{HOST}#{choice_path}"
       end
       choice_url
    end

end
