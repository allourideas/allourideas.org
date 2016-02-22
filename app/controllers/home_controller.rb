class HomeController < ApplicationController
  include ActionView::Helpers::TextHelper
  #caches_page :about, :tour, :privacy
  before_filter :authenticate, :only => [:admin]
  before_filter :admin_only, :only => [:no_google_tracking]

  skip_before_filter :initialize_session, :set_session_timestamp, :record_action, :view_filter, :set_pairwise_credentials, :set_locale, :set_p3p_header, :only => [:cookies_blocked]

  def index
    @example_earl = 'planyc_example'
    Question.timeout = 0.5
    begin
      @stats = Question.get(:site_stats)
    rescue
      @stats = {"total_questions" => 2803, "votes_count" => 3694534, "choices_count" => 139963}
    end
    Question.timeout = nil
  end

  def no_google_tracking
  end

  def cookies_blocked
    BlockedCookie.create(:ip_addr => request.remote_ip, :question_id => params[:question_id], :referrer => params[:referrer], :source => request.referrer, :user_agent => request.env["HTTP_USER_AGENT"], :session_id => params[:session_id])
    # send 1x1 gif in response
    send_data(Base64.decode64('R0lGODlhAQABAAAAADs='), :type => "image/gif", :disposition => "inline")
  end

  def example
	  redirect_to("/planyc_example") and return
  end

  def verify
  end

  def about
    #about_question = Question.find(1)#Const::ABOUT_QUESTION_ID)
    # set_pairwise_user(about_question.user.email, about_question.user.decoded_password)
    # @id, @question, @items, @votes = Pairwise.get_question(about_question.pairwise_id)
    # @url1 = named_url_for_question(about_question)
  end

  def admin
    if current_user.admin?
      if @photocracy
        @earls = Earl.find(:all, :conditions => {:photocracy => true})
      else
        @earls = Earl.find(:all, :conditions => {:photocracy => false})
      end
      all = params[:all] == 'true'
      @questions = Question.find(:all, :params => {
                                   :votes_since => Date.today,
                                   :user_ideas => true,
                                   :active_user_ideas => true,
                                   :all => all })

      @available_charts = {}
      @available_charts['votes'] = { :title => "Number of all votes over time"}
      @available_charts['user_submitted_ideas'] = { :title => "Number of all submitted ideas over time"}
      @available_charts['user_sessions'] = { :title => "Number of all user sessions per day"}
      @available_charts['unique_users'] = { :title => "Number of all unique users per day"}

      @blocked_cookies = BlockedCookie.today.group_by(&:question_id)
    else
      @earls = current_user.earls.sort_by {|x| [(!x.active).to_s, x.name]}
      @questions = Question.find(:all, :params => {
                                   :creator => current_user.id,
                                   :votes_since => Date.today,
                                   :all => true })
                                   
    end
    @questions_map = @questions.inject({}){ |h,q| h[q.id] = q; h }
  end

  def wikipedia_banner_challenge_gallery
    @earl = Earl.find_by_name('wikipedia-banner-challenge')
    @images = {
      "0001" => "http://meta.wikimedia.org/wiki/File:Jimmy.png",
      "0002" => "http://meta.wikimedia.org/wiki/File:Jamesbanner.png",
      "0003" => "http://meta.wikimedia.org/wiki/File:Isaacbanner.png",
      "0004" => "http://meta.wikimedia.org/wiki/File:Brandonpic.png",
      "0005" => "http://meta.wikimedia.org/wiki/File:Susan.png",
      "0006" => "http://meta.wikimedia.org/wiki/File:Sarahbanner.png",
      "0007" => "http://meta.wikimedia.org/wiki/File:06photo.png",
      "0008" => "http://meta.wikimedia.org/wiki/File:Maryanasmile.png",
      "0009" => "http://commons.wikimedia.org/wiki/File:The_Blue_Marble.jpg",
      "0010" => "http://commons.wikimedia.org/wiki/File:A_sunflower-Edited.png",
      "0011" => "http://commons.wikimedia.org/wiki/File:Firework.jpg",
      "0012" => "http://commons.wikimedia.org/wiki/File:Pennies.jpg",
      "0013" => "http://commons.wikimedia.org/wiki/File:Matterhorn_Riffelsee_2005-06-11.jpg",
      "0014" => "http://commons.wikimedia.org/wiki/File:Cherry_Stella444.jpg",
      "0015" => "http://commons.wikimedia.org/wiki/File:Strawberry444.jpg",
      "0016" => "http://commons.wikimedia.org/wiki/File:Toy_balloons_2011_G1.jpg",
      "0017" => "http://commons.wikimedia.org/wiki/File:Wonder_eye.png",
      "0018" => "http://commons.wikimedia.org/wiki/File:Cactus_flower_unidentified.jpg",
      "0019" => "http://commons.wikimedia.org/wiki/File:Aldrin_Apollo_11.jpg",
      "0020" => "http://commons.wikimedia.org/wiki/File:Jelly---Gummi-Bear---Yellow---Detailed---%28Gentry%29.jpg",
      "0021" => "http://commons.wikimedia.org/wiki/File:Daption_capense_in_flight_-_SE_Tasmania.jpg",
      "0022" => "http://commons.wikimedia.org/wiki/File:Stop_sign_light_red.svg",
      "0023" => "http://commons.wikimedia.org/wiki/File:Traffic_light_green.png",
      "0024" => "http://commons.wikimedia.org/wiki/File:Padlock-silver-light.svg",
      "0025" => "http://commons.wikimedia.org/wiki/File:Gift.png",
      "0026" => "http://commons.wikimedia.org/wiki/File:Too_little_information_-_geograph.org.uk_-_1272898.jpg",
      "0027" => "http://commons.wikimedia.org/wiki/File:Old_violin.jpg",
      "0028" => "http://commons.wikimedia.org/wiki/File:Violin_g1.svg",
      "0029" => "http://commons.wikimedia.org/wiki/File:Education_-_Grad_Hat.svg",
      "0030" => "http://commons.wikimedia.org/wiki/File:DNA_Double_Helix.png",
      "0031" => "http://commons.wikimedia.org/wiki/File%3AHarvesting_daisies.jpg",
      "0032" => "http://en.wikipedia.org/wiki/File:Llave_bronce.jpg",
      "0033" => "http://commons.wikimedia.org/wiki/File:Root-rendered-by-TeX.svg",
      "0034" => "http://en.wikipedia.org/wiki/File:Kitchen_utensils_hanging_below_a_spice_rack.jpg",
      "0035" => "http://meta.wikimedia.org/wiki/File:Wmf_sdtpa_servers_2009-01-20_34.jpg",
      "0036" => "http://commons.wikimedia.org/wiki/File:Einzelne_Kerze.JPG",
    }
    render(:template => 'wikipedia/gallery', :layout => '/wikipedia/layout') && return
  end
end
