class IdeaMailer < ActionMailer::Base

  default_url_options[:host] = HOST

  def notification(earl, question_name, choice_text, choice_id)
    setup_email(earl.user)
    @subject += "idea added to question: #{question_name}"
    @body[:question_name] = question_name
    @body[:earl] = earl
    @body[:choice_text] = choice_text
    @body[:choice_id] = choice_id
  end
  
  def notification_for_active(earl, question_name, choice_text, choice_id)
    setup_email(earl.user)
    @subject += "idea added to question: #{question_name}"
    @body[:question_name] = question_name
    @body[:earl] = earl
    @body[:choice_text] = choice_text
    @body[:choice_id] = choice_id
  end
  
  def extra_information(user, question, information)
    @recipients  = "signups@allourideas.org"
    @from        = "info@allourideas.org"
    @subject     = "[All Our Ideas] "
    @sent_on     = Time.now
    @body[:user] = user
    @body[:host] = "www.allourideas.org"

    @subject += "Extra Information included in #{question.the_name}"

    @body[:question] = question
    @body[:information] = information
  end

  def export_data_ready(email, link)
     setup_email(nil)
     @recipients  = email
     @subject += "Data export ready"
     @body[:url] = link
  end
  
  protected
    def setup_email(user)
      if user
        @recipients  = user.email
      end
      @from        = "info@allourideas.org"
      @subject     = "[All Our Ideas] "
      @sent_on     = Time.now
      @body[:user] = user
      @body[:host] = "www.allourideas.org"
    end

end
