unless Rails.env == "development" || Rails.env == "test"
   include SendGrid
end
class IdeaMailer < ActionMailer::Base

  default_url_options[:host] = APP_CONFIG[:HOST]

  def notification(earl, question_name, choice_text, choice_id, photocracy=false)
    setup_email(earl.user, photocracy)

    @subject += "#{photocracy ? 'photo' : 'idea'} added to question: #{question_name}"
    @question_name = question_name
    @earl = earl
    @choice_text = choice_text
    @choice_id = choice_id
    @choice_url = get_choice_url(earl.name, choice_id, photocracy, 'activate')
    @photocracy = photocracy
    @similar = find_similar(earl, choice_id).map{|c| get_choice_url(earl.name, c['id'], photocracy, nil)}
    @object_type = photocracy ? I18n.t('common.photo') : I18n.t('common.idea')

    mail(to: @recipients, from: @from, subject: @subject)
  end

  def notification_for_active(earl, question_name, choice_text, choice_id, photocracy=false)
    setup_email(earl.user, photocracy)
    @subject += "#{photocracy ? 'photo' : 'idea'} added to question: #{question_name}"
    @question_name = question_name
    @earl = earl
    @choice_text = choice_text
    @choice_id = choice_id
    @choice_url = get_choice_url(earl.name, choice_id, photocracy, 'deactivate')
    @photocracy = photocracy
    @similar = find_similar(earl, choice_id).map{|c| get_choice_url(earl.name, c['id'], photocracy, nil)}
    @object_type = photocracy ? I18n.t('common.photo') : I18n.t('common.idea')

    mail(to: @recipients, from: @from, subject: @subject)
  end

  def flag_notification(earl, choice_id, choice_data, explanation, photocracy=false)
    setup_email(earl.user, photocracy)

    @subject += "Possible inappropriate #{photocracy ? 'photo' : 'idea'} flagged by user"
    @bcc = photocracy ? APP_CONFIG[:INFO_PHOTOCRACY_EMAIL] : APP_CONFIG[:INFO_ALLOURIDEAS_EMAIL]
    @earl = earl
    @choice_id = choice_id
    @choice_data = choice_data
    @choice_url = get_choice_url(earl.name, choice_id, photocracy, 'activate')
    @explanation = explanation
    @photocracy = photocracy
    @object_type = photocracy ? I18n.t('common.photo') : I18n.t('common.idea')

    mail(to: @recipients, from: @from, subject: @subject)
  end

  def extra_information(user, question_name, information, photocracy=false)
    @recipients  = APP_CONFIG[:SIGNUPS_ALLOURIDEAS_EMAIL]
    @from        = APP_CONFIG[:INFO_ALLOURIDEAS_EMAIL]
    @subject     = photocracy ? "[Photocracy] " : "[All Our Ideas] "
    @sent_on     = Time.now
    @user = user
    @host = photocracy ? "www.photocracy.org" : "www.allourideas.org"
    @photocracy = photocracy

    @subject += "Extra Information included in #{question_name}"

    @question_name = question_name
    @information = information

    mail(to: @recipients, from: @from, subject: @subject)
  end

  def export_data_ready(email, link, photocracy=false)
    setup_email(nil, photocracy)
    @recipients  = email
    @subject += "Data export ready"
    @url = link
    @photocracy = photocracy

    mail(to: @recipients, from: @from, subject: @subject)
  end

  def export_failed(email, type, date_requested, photocracy=false)
    setup_email(nil, photocracy)
    @recipients = email
    @subject += "Data export failed"
    @photocracy = photocracy
    @date_requested = date_requested
    @type = type

    mail(to: @recipients, from: @from, subject: @subject)
  end

  protected
    def setup_email(user, photocracy=false)
      if user
        @recipients  = user.email
      end
      @from        = photocracy ? APP_CONFIG[:INFO_PHOTOCRACY_EMAIL] : APP_CONFIG[:INFO_ALLOURIDEAS_EMAIL]
      @subject     = photocracy ? "[Photocracy] " : "[All Our Ideas] "
      @sent_on     = Time.now
      @user = user
      @host = "www.#{photocracy ? 'photocracy' : 'allourideas'}.org"

    end

    def find_similar(earl, choice_id)
      choice = Choice.new
      choice.id = choice_id
      choice.prefix_options[:question_id] = earl.question_id
      choice.get('similar')
    end

    def get_choice_url(earl_name, choice_id, photocracy, option)
      url_options = {:question_id => earl_name, :id => choice_id}
      url_options.merge!(:photocracy_mode => true) if photocracy && Rails.env == "cucumber"
      url_options.merge!(:login_reminder => true) if photocracy

      if photocracy
        choice_path = Rails.application.routes.url_helpers.question_choice_path(url_options)
      elsif option == 'activate'
        choice_path = Rails.application.routes.url_helpers.activate_question_choice_path(url_options)
      elsif option == 'deactivate'
        choice_path = Rails.application.routes.url_helpers.deactivate_question_choice_path(url_options)
      else
        choice_path = Rails.application.routes.url_helpers.question_choice_path(url_options)
      end

      if photocracy
        choice_url = "http://#{APP_CONFIG[:PHOTOCRACY_HOST]}#{choice_path}"
      else
        choice_url = "http://#{APP_CONFIG[:HOST]}#{choice_path}"
      end
      choice_url
    end

end
