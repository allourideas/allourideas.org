class IdeaMailer < ActionMailer::Base

  default_url_options[:host] = HOST

  def notification(earl, question_name, choice_text, choice_id, photocracy=false)
    setup_email(earl.user, photocracy)
    @subject += "#{photocracy ? 'photo' : 'idea'} added to question: #{question_name}"
    @body[:question_name] = question_name
    @body[:earl] = earl
    @body[:choice_text] = choice_text
    @body[:choice_id] = choice_id
    @body[:photocracy] = photocracy
  end
  
  def notification_for_active(earl, question_name, choice_text, choice_id, photocracy=false)
    setup_email(earl.user, photocracy)
    @subject += "#{photocracy ? 'photo' : 'idea'} added to question: #{question_name}"
    @body[:question_name] = question_name
    @body[:earl] = earl
    @body[:choice_text] = choice_text
    @body[:choice_id] = choice_id
    @body[:photocracy] = photocracy
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
      @from        = "info@allourideas.org"
      @subject     = photocracy ? "[Photocracy] " : "[All Our Ideas] "
      @sent_on     = Time.now
      @body[:user] = user
      @body[:host] = "www.#{photocracy ? 'photocracy' : 'allourideas'}.org"
    end

end
