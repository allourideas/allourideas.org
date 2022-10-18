class QuestionsController < ApplicationController
  include ActionView::Helpers::TextHelper
  #require 'geokit'
  before_action :require_login, :only => [:admin, :toggle, :toggle_autoactivate, :update, :delete_logo, :export, :add_photos, :update_name]
  before_action :admin_only, :only => [:index, :admin_stats]
  #caches_page :results

  # GET /questions
  # GET /questions.xml
  def index
    @questions = Question.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @questions }
    end
  end

  def admin_stats
    question = Question.new(:id => params[:id])
    response = {
      "vote_rate" => question.get(:vote_rate)["voterate"].try(:round, 3),
      "upload_to_participation_rate" => question.get(:upload_to_participation_rate)["uploadparticipationrate"].try(:round, 3),
      "median_responses_per_session" => question.get(:median_responses_per_session)["median"],
      "votes_per_uploaded_choice" => question.get(:votes_per_uploaded_choice)["value"].try(:round, 3)
    }
    respond_to do |format|
      format.json { render :json => response.to_json }
    end
  end

  # GET /questions/1
  # GET /questions/1.xml
  # def show
  #   @question = Question.find(params[:id])
  #
  #   respond_to do |format|
  #     format.html # show.html.erb
  #     format.xml  { render :xml => @question }
  #   end
  # end
  def results
    @earl = Earl.find_by(name: params[:id])

    @question = @earl.question
    @question_id = @question.id

    unless (@question.user_can_view_results?(current_user, @earl))
      logger.info("Current user is: #{current_user.inspect}")
      flash[:notice] = t('user.not_authorized_error_results')
      redirect_to( "/#{params[:id]}") and return
    end

    current_page = params[:page] || 1
    current_page = current_page.to_i
    current_page = 1 if current_page == 0
    per_page = 10

    logger.info "current page is #{current_page} but params is #{params[:page]}"

    if params[:locale].nil? && @earl.default_lang != I18n.default_locale.to_s
      I18n.locale = @earl.default_lang
      redirect_to :action => :results, :controller => :questions, :id => @earl.name and return
    end

    logger.info "@question is #{@question.inspect}."
    @partial_results_url = "#{@earl.name}/results"
    if params[:all]
      choices = Choice.find(:all, :params => {:question_id => @question_id})
    else
      choices = Choice.find(:all, :params => {:question_id => @question_id,
                            :limit => per_page,
                            :offset => (current_page - 1) * per_page})
    end

    if @photocracy
      per_page = 10
      choices = Choice.find(:all, :params => {
        :question_id => @question_id,
        :limit => per_page,
        :offset => (current_page - 1) * per_page
      })
      @all_choices = Choice.find(:all, :params => {:question_id => @question_id})
    end

    @choices= WillPaginate::Collection.create(current_page, per_page) do |pager|
      pager.replace(choices)

      pager.total_entries = @question.choices_count - @question.inactive_choices_count

    end

    @available_charts = {}
    @available_charts['votes'] = { :title => t('results.votes_over_time_title')}
    @available_charts['user_submitted_ideas'] = { :title => t('results.user_ideas_over_time_title')}
    @available_charts['user_sessions'] = { :title => t('results.user_sessions_over_time_title')}

    if @photocracy
      @available_charts = [
        {:title => :scatter_ideas_title, :link => 'scatter_plot_user_vs_seed_ideas', :type => 'scatter_ideas', :div_id => 'scatter_ideas-chart-container', :response_type => 'script'},
        {:title => :world_map_title, :link => 'voter_map', :type => 'votes', :response_type => 'html', :div_id => 'voter_map'},
        {:title => :votes_over_time_title, :link => 'timeline_graph', :type => 'votes', :div_id => 'votes-chart-container', :response_type => 'script'},
        {:title => :user_ideas_over_time_title, :link => 'timeline_graph', :type => 'user_submitted_ideas', :div_id => 'user_submitted_ideas-chart-container', :response_type => 'script'},
        {:title => :user_sessions_over_time_title, :link => 'timeline_graph', :type => 'user_sessions', :div_id => 'user_sessions-chart-container', :response_type => 'script'}
      ]
    end

    if @widget == true
      render :layout => false
    elsif wikipedia?
      if params[:heat]
        @images = (1..12).map { |i| "00#{i < 10 ? "0" + i.to_s : i}" }
        @banners = [
          "The only non-profit website in the top 10.\nHelp keep us different",
          "679 servers. 282 languages.\n20 million articles.\nWe need your help to keep growing.",
          "Your donation powers the technology\nthat makes Wikipedia work",
          "Your donations power the technology\nthat makes Wikipedia work",
          "Your donation keeps Wikipedia's\nservers and staff running",
          "Your donations keep Wikipedia's\nservers and staff running",
          "Wikipedia is the #5 site on the Internet.\nYour $5 keeps us there.",
          "Use it?\nSupport it!",
          "Use Wikipedia?\nSupport Wikipedia!",
          "You can help keep Wikipedia free of ads.\nFor more information, click here.",
          "You can help keep Wikipedia free of ads.\nTo donate, click here.",
          "What would the Internet look like\nwithout Wikipedia?\nLet's not find out. Donate today.",
          "What would the Internet look like\nwithout Wikipedia?",
          "Wikipedia is a not-for-profit organization.\nPlease consider making a donation.",
          "Wikipedia is a not-for-profit organization.\nPlease make a donation.",
          "Want to make the world a better place?\nDonate to Wikipedia.",
          "Want to make the world a better place?\nWhat are you waiting for?",
          "Imagine a world in which every person\non the planet had free access to all\nhuman knowledge.",
          "Let's make a world in which every\nperson on the planet has free access to\nall human knowledge.",
          "Let's keep Wikipedia ad-free",
          "Let's keep Wikipedia free",
          "Let's keep Wikipedia growing",
          "Let's keep Wikipedia independent",
  #        "A personal appeal from\nWikipedia founder Jimmy Wales",
  #        "Please read:\nAdvertising isn't evil\nbut it doesn't belong on Wikipedia",
  #        "Advertising isn't evil\nbut it doesn't belong on Wikipedia",
  #        "Please read:\nA personal appeal from\nan author of 549 Wikipedia articles",
  #        "Please read:\nA personal appeal from\nWikipedia editor Dr. James Heilman",
  #        "Please read:\nA personal appeal from\nan author of 159 Wikipedia articles",
  #        "Please read:\nA personal appeal from\nWikipedia editor Isaac Kosgei",
  #        "I am a student, and I donated.\nWhat are you waiting for?",
  #        "Wikipedia is a vital global resource.\nPlease donate.",
  #        "To stay healthy and strong,\nWikipedia needs your donation",
  #        "Wikipedia helps you stay healthy.\nNow you can return the favor",
  #        "Just like a flower needs water,\nWikipedia needs your donation"
        ]
        @scores = {}
        choices = Choice.find(:all, :params => {:question_id => @question_id})
        scores = choices.map(&:score)
        if params[:dynamic_range] and params[:dynamic_range] == 'true'
          @max_score = scores.max
          @min_score = scores.min
        else
          @max_score = 100
          @min_score = 0
        end
        choices.each do |choice|
          image = choice.data[0..3]
          banner = choice.data[5..-1]
          if @images.include?(image) and @banners.include?(banner)
            @scores[banner] ||= {}
            @scores[banner][image] = {
              :score => choice.score,
              :color => color_for_score(choice.score)
            }
          end
          image = banner = nil
        end
        @missing_color = "#CCCCCC"
        render(:template => 'wikipedia/questions_results_heat', :layout => '/wikipedia/layout')
      else
        render(:template => 'wikipedia/questions_results', :layout => '/wikipedia/layout')
      end
      return
    end

  end

  def scatter_num_ratings_by_creation_time
      type = params[:type] # should be scatter_num_ratings_by_date_added
      @earl = Earl.find_by(name: params[:id])
      @choices = Choice.find(:all, :params => {:question_id => @earl.question_id})

      @choices.sort!{|a, b| a.created_at <=> b.created_at}

      chart_data = []
      @choices.each_with_index do |c, i|
        point = {}
        point[:name] = c.data.strip.gsub("'", "") + "@@@" + c.id.to_s + "@@@" + c.created_at.to_s
        point[:x] = i
        point[:y] = c.wins + c.losses
        chart_data << point
      end

      choice_url = url_for(:action => 'show', :controller => "choices", :id => 'fakeid', :question_id => @earl.name)
      tooltipformatter = "function() {  var splitresult = this.point.name.split('@@@');
                                        var name = splitresult[0];
          var id = splitresult[1];
          var created = splitresult[2];

          return '<b>' + name + '</b>: '+ this.y + ' ratings <br /> Created: ' + created; }"

      moreinfoclickfn= "function() {  var splitresult = this.name.split('@@@');
                                        var name = splitresult[0];
          var id = splitresult[1];
          var created = splitresult[2];

          var fake_url= '#{choice_url}';
          var the_url = fake_url.replace('fakeid',id);

          location.href=the_url;}"
      @votes_chart = Highchart.spline({
        :chart => { :renderTo => "#{type}-chart-container",
        :margin => [50, 25, 60, 100],
        :borderColor =>  '#919191',
        :borderWidth =>  '1',
        :borderRadius => '0',
        :backgroundColor => '#FFFFFF'
#       :height => '500'
      },
      :legend => { :enabled => false },
            :title => { :text => "Number of ratings per idea by creation date",
            :style => { :color => '#919191' }
      },
      :x_axis => {:type => 'linear',
          :title => {:enabled => true, :text => "Non Uniform Date Intervals"}},
          :y_axis => {:type => 'linear', :min => 0,
          :title => {:enabled => true, :text => "Number of ratings"}},
          :plotOptions => {:scatter => { :point => {:events => {:click => moreinfoclickfn }}}},
          :series => [ { :name => "#{type.gsub("_", " ").capitalize}",
          :type => 'scatter',
          :color => 'rgba( 49,152,193, .5)',
          :data => chart_data }],
          :tooltip => { :formatter => tooltipformatter }

      })

      respond_to do |format|
      format.html { render :text => "<div id='#{type}-chart-container'></div><script type='text/javascript'>#{@votes_chart}</script>"}
        format.js { render :text => @votes_chart }
     end


  end


  # TODO: declare as private
  # calculate color heat map
  def color_for_score(score)
    denom = (@max_score - @min_score)
    if denom == 0
      @missing_color
    else
      max = 255
      mid = @min_score + denom / 2
      if score > mid
        # white to red
        red = max
        green = blue = scale(score, [@max_score, mid], [0, max])
      else
        # blue to white
        blue = max
        red = green = scale(score, [mid, @min_score], [max, 0])
      end
      "rgb(#{red},#{green},#{blue})"
    end
  end

  # TODO: declare as private
  # scale numeric val from array src to array dst range, return integer
  def scale(val, src, dst)
    (((val - src[0]) / (src[1]-src[0])) * (dst[1]-dst[0]) + dst[0]).to_i
  end

  def admin
    logger.info "@question = Question.find_by_name(#{params[:id]}) ..."
    @earl = Earl.find_by(name: params[:id])

    unless ((current_user.owns?(@earl)) || current_user.admin?)
      logger.info("Current user is: #{current_user.inspect}")
      flash[:notice] = t('user.not_authorized_error')
      redirect_to( "/#{params[:id]}") and return
    end

    @question = @earl.question
    @partial_results_url = "#{@earl.name}/results"

    @choices = Choice.find(:all, :params => {:question_id => @question.id, :include_inactive => true})
  end

  def word_cloud
    @earl = Earl.find_by(name: params[:id])
    type = params[:type]

    ignore_word_list = %w( a an as and is or the of for in to with on / - &)
    @word_frequency = Hash.new(0)
    @choices = Choice.find(:all, :params => {:question_id => @earl.question_id})

    min_val = nil
    @choices.each do|c|
      if c.data
        if type && type.starts_with?("uploaded")
          unless c.user_created
            next
          end
        end
        c.data.split(" ").each do|word|
          word.downcase!
          if ignore_word_list.include?(word)
            next
          end
          if type == "weight_by_score" || type == "uploaded_weight_by_score"
            @word_frequency[word] += c.score.to_i
            min_val = c.score if min_val.nil? || c.score < min_val
          else
            @word_frequency[word] +=1
            min_val = 1 if min_val.nil?
          end
        end
      end
    end

    if !type || !type.starts_with?("uploaded")
      @word_frequency.delete_if { |word, score| score <= min_val}
    end


    @target_div = 'wcdiv'
    if type
      @target_div+= "-" + type
    end
    @word_cloud_end = ""
    @word_cloud_js = ""
    if @word_frequency.size != 0
      @word_cloud_js ="
          var thedata = new google.visualization.DataTable();
          thedata.addColumn('string', 'Label');
          thedata.addColumn('number', 'Value');
          thedata.addColumn('string', 'Link'); //optional link
          thedata.addRows(#{@word_frequency.size});
      "
      @word_cloud_end = "
          var outputDiv = document.getElementById('#{@target_div}');
          var tc = new TermCloud(outputDiv);
          tc.draw(thedata, null);
      "
    end

    respond_to do |format|
      format.html { render :layout => false }
      format.js
    end
  end



  def voter_map
    logger.info "@question = Question.find_by_name(#{params[:id]}) ..."
    type = params[:type] || 'votes'
    data = Earl.voter_map(params[:id], type)

    case type
    when "votes" then
      @object_type = t('common.votes')
    when "all_photocracy_votes" then
      @object_type = t('common.votes')
    when "all_aoi_votes" then
      @object_type = t('common.votes')
    when "uploaded_ideas" then
      @object_type = t('results.uploaded_ideas')
    when "bounces" then
      @object_type = "bounces"
    when "all" then
      @object_type = t('common.votes')
    when "all_creators" then
      @object_type = "questions"
    end

    @total = data[:total]
    @votes_by_geoloc = data[:votes_by_geoloc]
    respond_to do |format|
      format.html {render :layout => false}
      format.js
    end
  end

  def scatter_plot_user_vs_seed_ideas
    type = params[:type] # should be scatter_ideas
    @earl = Earl.find_by(name: params[:id])
    @choices = Choice.find(:all, :params => {:question_id => @earl.question_id})

    seed_data = []
    user_data = []
    jitter = {}
    jitter[0] = Hash.new(0)
    jitter[1] = Hash.new(0)
    @choices.each_with_index do |c, i|

      point = {}
      if @photocracy
        point[:name] = "<img src='#{Photo.find(c.data).image.url(:thumb)}' width='50' height='50' />"
      else
        point[:name] = CGI::escapeHTML(c.data.strip.gsub("'", "")) + "@@@" + c.id.to_s
      end
      point[:color] = c.attributes['user_created'] ? '#BF0B23' : '#0C89F0'
      point[:x] = c.score.round
      point[:y] = c.attributes['user_created'] ? 1 : 0

      jitter[point[:y]][point[:x]] += 0.04

      thejitter = [jitter[point[:y]][point[:x]], 0.5].min

      point[:y] += thejitter

      if c.attributes['user_created']
        user_data << point
      else
        seed_data << point
      end
    end

    choice_url = url_for(:action => 'show', :controller => "choices", :id => 'fakeid', :question_id => @earl.name)

    tooltipformatter = "function() {  var splitresult = this.point.name.split('@@@');
                        var name = splitresult[0];
                        var id = splitresult[1];
                        return '<b>' + name + '</b>: '+ this.x; }"

                        moreinfoclickfn= "function() {  var splitresult = this.name.split('@@@');
                      var name = splitresult[0];
                      var id = splitresult[1];
                      var fake_url= '#{choice_url}';
                      var the_url = fake_url.replace('fakeid',id);
                      location.href=the_url;}"

                      @votes_chart = Highchart.spline({
                        :chart => {
                        :renderTo => "#{type}-chart-container",
                        :margin => [50, 25, 60, 100],
                        :borderColor =>  '#919191',
                        :borderWidth =>  '1',
                        :borderRadius => '0',
                        :backgroundColor => '#FFFFFF',
                        :height => '500'
                      },
                        :legend => { :enabled => false },
                        :title => {
                        :text => t('results.scores_of_uploaded_and_orginal_ideas'),
                        :style => { :color => '#919191' }
                      },
                        :subtitle => {
                        :text => t('results.rollover_to_see_more'),
                        :style => { :color => '#919191' }
                      },
                        :x_axis => {
                        :min => '0',
                        :max => '100',
                        :endOnTick => true,
                        :showLastLabel => true,
                        :type => 'linear',
                        :title => {:enabled => true, :text => t('common.score').titleize}
                      },
                        :y_axis => {
                        :categories => [t('results.original_ideas'), t('results.uploaded_ideas')],
                        :showLastLabel => false,
                        :gridLineWidth => 0,
                        :max => 1.4,
                        :min => 0,
                        :plotLines => [{ :id => 1, :color => "#000000", :value => 1, :width => 1 }]
                      },
                        :plotOptions => {
                        :scatter => {:point => {:events => {:click => moreinfoclickfn }}}
                      },
                        :series => [{
                        :name => "Uploaded Ideas",
                        :type => 'scatter',
                        :color => 'rgba(223, 83, 83, .5)',
                        :data => user_data
                      },
                        {
                        :name => "Original Ideas",
                        :type => 'scatter',
                        :color => 'rgba( 49,152,193, .5)',
                        :data => seed_data
                      }

                      ],

                        :tooltip => { :formatter => tooltipformatter }
                      })

    respond_to do |format|
      format.html { render :text => "<div id='#{type}-chart-container'></div><script type='text/javascript'>#{@votes_chart}</script>"}
      format.js { render :text => @votes_chart }
    end
  end

  def scatter_votes_vs_skips
    @earl = Earl.find_by(name: params[:id])
    @question = Question.new(:id => @earl.question_id)
    votes_by_sids = object_info_to_hash(@question.get(:object_info_by_visitor_id, :object_type => 'votes'))

    skips_by_sids = object_info_to_hash(@question.get(:object_info_by_visitor_id, :object_type => 'skips'))

    chart_data = []
    max_x = 0
    max_y = 0
    votes_by_sids.each do |sid, votes|
      point = {}
      point[:x] = votes
      max_x = votes.to_i if votes.to_i > max_x
      if skips = skips_by_sids.delete(sid)
        point[:y] = skips
        max_y = skips.to_i if skips.to_i > max_y
      else
        point[:y] = 0
      end

      point[:name] = sid.to_s
      chart_data << point
    end
    # if any sids remain, they have not voted
    skips_by_sids.each do |sid, skips|
      point = {}
      point[:x] = 0
      point[:y] = skips
      max_y = skips.to_i if skips.to_i > max_y

      point[:name] = sid
      chart_data << point
    end
    tooltipformatter = "function() { return  this.x + ' Votes '  + this.y + ' Skips '; }"
    @votes_chart = Highchart.scatter({
      :chart => { :renderTo => "scatter_votes_vs_skips-chart-container",
        :margin => [50, 25, 60, 50],
        :borderColor =>  '#919191',
        :borderWidth =>  '1',
        :borderRadius => '0',
        :backgroundColor => '#FFFFFF'
    },
      :legend => { :enabled => false },
      :title => { :text => "Number of Votes and Skips by session",
        :style => { :color => '#919191' }
    },
      :x_axis => { :type => 'linear', :min => 0, :max => max_x,
        :title => {:enabled => true, :text => "Votes"}},
        :y_axis => { :min => 0, :max => max_y, :type => 'linear' , :title => {:enabled => true, :title => "Skips"}},
        :series => [ { :type => 'scatter',
          :color => 'rgba( 49,152,193, .5)',
          :data => chart_data }],
          :tooltip => { :formatter => tooltipformatter }

    })
    respond_to do |format|
      format.html { render :text => "<div id='scatter_votes_vs_skips-chart-container'></div><script>#{@votes_chart}</script>" }
      format.js { render :text => @votes_chart }
    end
  end

  def scatter_score_vs_votes
    @earl = Earl.find_by(name: params[:id])
    @choices = Choice.find(:all, :params => {:question_id => @earl.question_id})

    chart_data = []

    @choices.each do |choice|
      point = {}
      point[:x] = choice.score
      point[:y] = choice.wins + choice.losses

      point[:name] = CGI::escapeHTML(choice.data.strip.gsub("'",""))
      chart_data << point
    end
    tooltipformatter = "function() { return  this.point.name + ' Score: ' +  this.x + ' Votes: '  + this.y; }"
    @votes_chart = Highchart.scatter({
      :chart => { :renderTo => "scatter_score_vs_votes-chart-container",
        :margin => [50, 25, 60, 50],
        :borderColor =>  '#919191',
        :borderWidth =>  '1',
        :borderRadius => '0',
        :backgroundColor => '#FFFFFF'
    },
      :legend => { :enabled => false },
      :title => { :text => "Choice Score vs Number of Votes",
        :style => { :color => '#919191' }
    },
      :x_axis => { :type => 'linear', :min => 0, :max => 100,
        :title => {:enabled => true, :text => "Score"}},
        :y_axis => { :type => 'linear', :title => {:enabled => true, :title => "Total Votes - wins + losses"}},
        :series => [ { :type => 'scatter',
          :color => 'rgba( 49,152,193, .5)',
          :data => chart_data }],
          :tooltip => { :formatter => tooltipformatter }

    })
    respond_to do |format|
      format.html { render :text => "<div id='scatter_score_vs_votes-chart-container'></div><script>#{@votes_chart}</script>" }
      format.js { render :text => @votes_chart }
    end
  end

  def scatter_votes_by_session
    type = params[:type]
    @earl = Earl.find_by(name: params[:id])
    @question = Question.new(:id => @earl.question_id)

    votes_by_sids = object_info_to_hash(@question.get(:object_info_by_visitor_id, :object_type => 'votes'))
    bounces_by_sids = object_info_to_hash(@question.get(:object_info_by_visitor_id, :object_type => 'bounces'))

    if bounces_by_sids != "\n"
      bounce_hash = {}
      bounces_by_sids.each do |k|
        bounce_hash[k] = 0
      end
      votes_by_sids.merge!(bounce_hash)
    end

    case type
    when "votes"
      objects_by_sids = votes_by_sids

    when "skips"
      skips_by_sids = object_info_to_hash(@question.get(:object_info_by_visitor_id, :object_type => 'skips'))

      skips_by_sids.each do |k,v|
        votes_by_sids.delete(k)
      end

      no_skips_size = votes_by_sids.size
      objects_by_sids = skips_by_sids
    end

    chart_data = []
    jitter = Hash.new(0)

    jitter_const = 1
    max = 0
    objects_by_sids.sort { |a,b| a[1].to_i <=> b[1].to_i}.each do |sid, votes|
      point = {}
      point[:x] = votes
      max = votes.to_i if votes.to_i > max
      point[:y] = jitter[votes] += jitter_const
      point[:name] = sid.to_s
      chart_data << point
    end
    chart_title = "Number of #{type} by session"
    if no_skips_size
      chart_title += ". Sessions with no skips: #{no_skips_size}"
    end

    tooltipformatter = "function() { return '<b>' + this.x + ' #{type.titleize} </b>' ; }"
    @votes_chart = Highchart.scatter({
      :chart => { :renderTo => "scatter_#{type}_by_session-chart-container",
        :margin => [50, 25, 60, 50],
        :borderColor =>  '#919191',
        :borderWidth =>  '1',
        :borderRadius => '0',
        :backgroundColor => '#FFFFFF'
    },
      :legend => { :enabled => false },
      :title => { :text => chart_title,
        :style => { :color => '#919191' }
    },
      :x_axis => { :type => 'linear', :min => 0, :max => max,
        :title => {:enabled => true, :text => type.titleize}},
        :y_axis => { :min => 0, :type => 'linear' },
        :series => [ { :name => "#{type.gsub("_", " ").capitalize}",
          :type => 'scatter',
          :color => 'rgba( 49,152,193, .5)',
          :data => chart_data }],
          :tooltip => { :formatter => tooltipformatter }

    })
    respond_to do |format|
      format.html { render :text => "<div id='scatter_#{type}_by_session-chart-container'></div><script>#{@votes_chart}</script>" }
      format.js { render :text => @votes_chart }
    end
  end

  def timeline_graph
    totals = params[:totals]
    type = params[:type] || 'votes'

    if !totals || totals != "true"
      @earl = Earl.find_by(name: params[:id])
      @question = Question.new(:id => @earl.question_id)
    end

    case type
    when 'votes'
      if totals == "true"
        votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'votes')
      else
        votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'votes')
      end
      chart_title = t('results.number_of_votes_per_day')
      y_axis_title = t('items.number_of_votes')
    when 'skips'
      if totals == "true"
        votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'skips')
      else
        votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'skips')
      end
      chart_title = t('results.number_of') +  t('common.skips') + t('results.per_day')
      y_axis_title = t('results.number_of') + t('common.skips')
    when 'user_sessions'
      if totals == "true"
        votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'user_sessions')
      else
        votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'user_sessions')
      end
      chart_title = t('results.number_of_user_sessions_per_day')
      y_axis_title = t('results.number_of_user_sessions')
    when 'user_submitted_ideas'
      if totals == "true"
        votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'user_submitted_ideas')
      else
        votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'user_submitted_ideas')
      end
      chart_title = t('results.number_of_ideas_per_day')
      y_axis_title = t('results.number_of_ideas')
    when 'unique_users'
      if totals == "true"
        chart_title = t('results.number_of') +  t('common.users').titleize + t('results.per_day')
        y_axis_title = t('results.number_of') + t('common.users')
        result = SessionInfo.select('date(created_at) as date, visitor_id, count(*) as session_id_count').group('date(created_at), visitor_id')
        votes_count_hash = Hash.new(0)

        result.each do |r|
          votes_count_hash[r.date.to_s.gsub('-','_')] +=1
        end
      end

    end

    if votes_count_hash == "\n"
      render :text => "$('\##{type}-chart-container').text('#{t('results.no_data_error')}');" and return
    end

    votes_count_hash.sort! do |x,y|
      x['date'] <=> y['date']
    end
    chart_data =[]
    start_date = nil
    current_date = nil
    votes_count_hash.each do |votes|

      hash_date_string = votes['date']
      if hash_date_string.class == Date
        hash_date = hash_date_string
      else
        hash_date = Date.strptime(hash_date_string, "%Y-%m-%d")
      end
      if start_date.nil?
        start_date = hash_date
        current_date= start_date
      end

      # We need to add in a blank entry for every day that doesn't exist
      while current_date != hash_date do
        chart_data << 0
        current_date = current_date + 1
      end
      chart_data  << votes['count']
      current_date = current_date + 1
    end
    start_date = Time.now.to_date if start_date.nil?
    tooltipformatter = "function() { return '<b>' + Highcharts.dateFormat('%b. %e %Y', this.x) +'</b>: '+ this.y +' '+ this.series.name }"

    overalltotal = chart_data.inject(0){|total, val| total + val}
    @votes_chart = Highchart.spline({
      :chart => { :renderTo => "#{type}-chart-container",
        :margin => [50, 25, 60, 80],
        :borderColor =>  '#919191',
        :borderWidth =>  '1',
        :borderRadius => '0',
        :backgroundColor => '#FFFFFF'
    },
      :legend => { :enabled => false },
      :title => { :text => chart_title + " " +  t('results.overall_total') + overalltotal.to_s,
        :style => { :color => '#919191' }
    },
      :x_axis => { :type => 'datetime', :title => {:text => t('results.date')}},
      :y_axis => { :min => '0', :title => {:text => y_axis_title, :style => { :color => '#919191'}}},
      :series => [ { :name => "#{type.gsub("_", " ").capitalize}",
        :type => 'line',
        :pointInterval => 86400000,
        #:pointStart => 1263859200000,
        :color => '#3198c1',
        :pointStart => start_date.to_time.to_i * 1000,
        :data => chart_data }],
        :tooltip => { :formatter => tooltipformatter }

    })
    respond_to do |format|
      format.html { render :text => "<div id='#{type}-chart-container'></div><script>#{@votes_chart}</script>" }
      format.js { render :text => @votes_chart }
    end
  end

  def density_graph
    @earl = Earl.find_by(name: params[:id])
    @densities = Density.find(:all, :params=> {:question_id => @earl.question_id})

    type = params[:type]

    prompt_types = ["seed_seed", "seed_nonseed","nonseed_seed","nonseed_nonseed"]

    if @densities.blank?
      text = "Cannot make chart, no data."
    else
      text = ""

      chart_title = "Density of votes over time by prompt type"
      y_axis_title = "Density of votes"

      chart_data = {}
      prompt_types.each do |the_type|
        chart_data[the_type] = []
      end

      start_date = nil
      current_date = nil
      @densities.each do |d|
        hash_date = d.created_at.to_date

        if start_date.nil?
          start_date = hash_date
          current_date= start_date
        end

        # We need to add in a blank entry for every day that doesn't exist
        if d.value.nil?
          chart_data[d.prompt_type] << 0
        else
          chart_data[d.prompt_type] << d.value
        end
      end

      the_series = []

      prompt_types.each do |the_type|
        the_series << { :name => the_type.humanize,
          :type => 'line',
          :pointInterval => 86400000,
          :color => '#3198c1',
          :pointStart => start_date.to_time.to_i * 1000,
          :data => chart_data[the_type] }
      end
      tooltipformatter = "function() { return '<b>' + Highcharts.dateFormat('%b. %e %Y', this.x) +'</b>: '+ this.y +' '+ this.series.name }"

      @density_chart = Highchart.spline({
        :chart => { :renderTo => "#{type}-chart-container",
          :margin => [50, 25, 60, 80],
          :borderColor =>  '#919191',
          :borderWidth =>  '1',
          :borderRadius => '0',
          :backgroundColor => '#FFFFFF'
      },
        :legend => { :enabled => true},
        :title => { :text => chart_title,
          :style => { :color => '#919191' }
      },
        :x_axis => { :type => 'datetime', :title => {:text => t('results.date')}},
        :y_axis => { :min => '0', :title => {:text => y_axis_title, :style => { :color => '#919191'}}},
        :series => the_series,
        :tooltip => { :formatter => tooltipformatter }

      })
    end
    respond_to do |format|
      format.html { render :text => "<div id='#{type}-chart-container'>#{text}</div><script>#{@density_chart}</script>"}
      format.js { render :text => @density_chart}
    end
  end

  def choices_by_creation_date
    #authenticate admin only
    @earl = Earl.find_by(name: params[:id])
    @question = Question.new(:id => @earl.question_id)

    appearance_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'appearances_by_creation_date')

    if appearance_count_hash == "\n"
      render :text => "$('\##{type}-chart-container').text('#{t('results.no_data_error')});"  and return
    end

    appearance_count_hash.sort! do |x,y|
      x['date'] <=> y['date']
    end
    chart_data =[]
    x_value = 0
    last_date = nil
    appearance_count_hash.each do |appearance|

      date = appearance['date']
      # increment x_value based on gaps between this date and the last
      unless last_date.nil?
        x_value += (date - last_date).to_i
      end

      point = {}
      point[:x] = x_value
      point[:y] = appearance['appearances']
      point[:name] = CGI::escapeHTML(appearance['data'].strip.gsub("'","")) + "@@@" + date.to_s
      chart_data  << point
      last_date = date
    end
    tooltipformatter = "function() {  var splitresult = this.point.name.split('@@@');
                                        var name = splitresult[0];
          var date = splitresult[1];

                                        return '<b>' + name + '</b>: '+ this.y + ' Appearances<br> Created on: ' + date; }"
                                        @votes_chart = Highchart.spline({
                                          :chart => { :renderTo => "choice-by-date-chart-container",
                                            :margin => [50, 25, 60, 100],
                                            :borderColor =>  '#919191',
                                            :borderWidth =>  '1',
                                            :borderRadius => '0',
                                            :backgroundColor => '#FFFFFF'
                                        },
                                          :legend => { :enabled => false },
                                          :title => { :text => 'Number of Appearances per Choice by Number of Days Since Idea Marketplace Creation',
                                            :style => { :color => '#919191' }
                                        },
                                          :x_axis => { :type => 'linear',  :min => -0.5, :title => {:text => "Number of days since wiki survey creation",:enabled => true} },
                                          :y_axis => { :type => 'linear', :min => 0, :title => {:text => 'Number of Appearances'}},
                                          :series => [ { :name => "Data",
                                            :type => 'scatter',
                                            :color => 'rgba( 49,152,193, .5)',
                                            :data => chart_data }],
                                            :tooltip => { :formatter => tooltipformatter }

                                        })


    respond_to do |format|
      format.html { render :text => "<div id='choice-by-date-chart-container'></div><script>#{@votes_chart}</script>" }
      format.js { render :text => @votes_chart }
    end
  end

  def add_idea
    bingo!('submitted_idea')
    new_idea_data = params[:new_idea]

    if @photocracy
      new_photo = Photo.create(:image => params[:new_idea], :original_file_name => params[:new_idea].original_filename)
      if new_photo.valid?
        new_idea_data = new_photo.id
      else
        render :text => {'errors' => new_photo.errors.full_messages.join("\n"), 'response_status' => 500}.to_json and return
      end
    else
      # remove new lines from new ideas
      if new_idea_data.class == String
        new_idea_data.gsub!(/[\n\r]/, ' ') unless wikipedia?
      end
    end

    choice_params = {:visitor_identifier => @survey_session.session_id,
      :data => new_idea_data,
      :question_id => params[:id]}

    choice_params.merge!(:local_identifier => current_user.id) if signed_in?


    if @choice = Choice.create(choice_params)
      @question = Question.find(params[:id], :params => {
        :with_visitor_stats => true,
        :visitor_identifier => @survey_session.session_id
      })
      @earl = Earl.find_by(question_id: params[:id].to_s)

      if @choice.active?
        IdeaMailer.delay.deliver_notification_for_active(@earl, @question.name, new_idea_data, @choice.id, @photocracy)
      else
        IdeaMailer.delay.deliver_notification(@earl, @question.name, new_idea_data, @choice.id, @photocracy)
      end

      if @photocracy
        render :text => {'thumbnail_url' => new_photo.image.url(:thumb), 'response_status' => 200}.to_json #text content_type is important with ajaxupload
      else
        render :json => {
          :choice_status => @choice.active? ? 'active' : 'inactive',
          :message => "#{t('items.you_just_submitted')}: #{CGI::escapeHTML(new_idea_data)}"
        }.to_json
      end
    else
      render :json => '{"error" : "Addition of new idea failed"}'
    end
  end

  def toggle
    expire_page :action => :results
    @earl = Earl.find(params[:id])
    unless ((current_user.owns?(@earl)) || current_user.admin? )
      render(:json => {:message => "You don't have permission to do that for question #{params[:id]}"}.to_json) and return
    end
    logger.info "Getting ready to change active status of Question #{params[:id]} to #{!@earl.active?}"

    respond_to do |format|
      format.xml  {  head :ok }
      format.js  {
        @earl.active = !(@earl.active)
        verb = @earl.active ? t('items.list.activated') : t('items.list.deactivated')
        if @earl.save!
          logger.info "just #{verb} question"
          render :json => {:message => "You've just #{verb.downcase} your question", :verb => verb}.to_json
        else
          render :json => {:message => "You've just #{verb.downcase} your question", :verb => verb}.to_json
        end
      }
    end
  end

  def toggle_autoactivate
    @earl = Earl.find_by(question_id: params[:id].to_s)
    @question = @earl.question
    unless ((current_user.owns?(@earl)) || current_user.admin?)
      render(:json => {:error => "You do not have access to this question."}.to_json) and return
    end
    logger.info "Getting ready to change idea autoactivate status of Question #{params[:id]} to #{!@question.it_should_autoactivate_ideas?}"

    @question.it_should_autoactivate_ideas = !@question.it_should_autoactivate_ideas
    verb = @question.it_should_autoactivate_ideas ? 'Enabled' : 'Disabled'

    respond_to do |format|
      logger.info("Question is: #{@question.inspect}")
      format.xml  {  head :ok }
      format.js  {
        if @question.save
          logger.info "just #{verb} auto_activate ideas for this question"
          render :json => {:message => "You've just #{verb.downcase} idea auto-activation", :verb => verb}.to_json
        else
          render :json => {:message => "You've just #{verb.downcase} idea auto-activation", :verb => verb}.to_json
        end
      }
    end
  end

  # GET /questions/new
  # GET /questions/new.xml
  def new
    @errors ||= []
    @question = Question.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @question }
    end
  end

  def question_creation_validates?(question)
    # question.errors = []
    question.validate
    false unless question.errors.empty?
    #false
  end

  # POST /questions
  # POST /questions.xml
  def create
    question_params = params[:question]
    @question = Question.new(
      :name => question_params[:name],
      :ideas => question_params[:ideas],
      :url => question_params[:url],
      :information => question_params[:information],
      :user_id => current_user.id
    )
    @user = User.new(:email => params[:question]['email'],
                     :password => params[:question]['password'],
                     :password_confirmation => params[:question]['password']) unless signed_in?

    spam_check = /\A[a-z]+\z/i
    looks_like_spam = !!question_params['name'].try(:match, spam_check) && !!question_params['url'].try(:match, spam_check) && !!question_params['ideas'].try(:match, spam_check) && !!question_params['information'].try(:match, spam_check)

    @question.errors.add(:base, "Unable to create question. If problem persists, email info@allourideas.org") if looks_like_spam
    if !looks_like_spam and question_params_valid
      earl_options = {:question_id => @question.id, :name => params[:question]['url'].strip, :ideas => params[:question].try(:[], :ideas)}
      earl_options.merge!(:flag_enabled => true, :photocracy => true) if @photocracy # flag is enabled by default for photocracy
      earl = current_user.earls.create(earl_options)
      #TODO: Get mail working
      #ClearanceMailer.delay.deliver_confirmation(current_user, earl, @photocracy)
      #IdeaMailer.delay.deliver_extra_information(current_user, @question.name, params[:question]['information'], @photocracy) unless params[:question]["information"].blank?
      if earl.requires_verification?
        redirect_to verify_url and return
      end
      session[:standard_flash] = "#{t('questions.new.success_flash')}<br /> #{t('questions.new.success_flash2')}: <a href='#{@question.fq_earl}'>#{@question.fq_earl}</a> #{t('questions.new.success_flash3')}<br /> #{t('questions.new.success_flash4')}: <a href=\"#{@question.fq_earl}/admin\"> #{t('nav.manage_question')}</a>".html_safe

      if @photocracy
        redirect_to add_photos_url(earl.name) and return
      else
        redirect_to(:action => 'show', :id => earl.name, :just_created => true, :controller => 'earls') and return
      end
    else
      render(:action => "new")
    end
  end

  def question_params_valid
    if @question.valid?(@photocracy) && (signed_in? || (@user.valid? && @user.save && sign_in(@user)))
      @question.attributes.merge!({'local_identifier' => current_user.id,
                                  'visitor_identifier' => @survey_session.session_id})
      return true if @question.save
    else
      return false
    end
  end


  def update_name
    @earl = Earl.find params[:id]
    @question = @earl.question
    respond_to do |format|
      if ((@question.votes_count == 0 && current_user.owns?(@earl)) || current_user.admin?)
        if params[:question][:name]
          @question.name = params[:question][:name]
          if @question.save
            format.json { render :json => { :status => 'success', :question => @question}, :status => 200 }
          else
            format.json { render :json => { :status => 'failed', :question => @question}, :status => 403 }
          end
        end
      else
        format.json { render :json => { :status => 'failed', :question => @question}, :status => 403 }
      end
    end
  end

  # # PUT /questions/1
  # # PUT /questions/1.xml
  def update
    @earl = Earl.find params[:id]
    @question = @earl.question

    unless ( (current_user.owns? @earl) || current_user.admin?)
      flash[:notice] = "You are not authorized to view that page"
      redirect_to( {:action => :show, :controller => :earls},  :id=> params[:id]) and return
    end


    respond_to do |format|
      old_lang = @earl.default_lang
      if @earl.update_attributes(params[:earl].slice(:pass, :logo, :welcome_message, :default_lang, :flag_enabled, :ga_code, :question_should_autoactivate_ideas, :hide_results, :active, :show_cant_decide, :show_add_new_idea))
        flash[:notice] = 'Question settings saved successfully!'
        # redirect to new lang if lang was changed
        if old_lang != @earl.default_lang
          I18n.locale = @earl.default_lang
        end
        format.html {redirect_to(:action => 'admin', :id => @earl.name) and return }
      else
        @partial_results_url = "#{@earl.name}/results"
        @choices = Choice.find(:all, :params => {:question_id => @question.id, :include_inactive => true})

        format.html { render :action => 'admin'}
        #format.xml  { render :xml => @question.errors, :status => :unprocessable_entity }
      end
    end
  end
  def delete_logo
    @earl = Earl.find_by(name: params[:id])

    unless ((current_user.owns?(@earl)) || current_user.admin? )
      logger.info("Current user is: #{current_user.inspect}")
      flash[:notice] = "You are not authorized to view that page"
      redirect_to( "/#{params[:id]}") and return
    end
    @question = @earl.question

    @earl.logo = nil
    respond_to do |format|
      if @earl.save

        logger.info("Deleting Logo from earl")
        flash[:notice] = 'Question settings saved successfully!'
        format.html {redirect_to :action => "admin" and return }
        # format.xml  { head :ok }
      else
        format.html { render :action => "admin"}
        #format.xml  { render :xml => @question.errors, :status => :unprocessable_entity }
      end

    end
  end

  def export
    type = params[:type]
    @earl = Earl.find_by(name: params[:id])
    unless ((current_user.owns?(@earl)) || current_user.admin? )
      response = "You are not authorized to export data from this wiki survey, please contact us at info@allouridea.org if you think this is a mistake"
      render :text => response and return
    end

    #creates delayed job that: sends request to pairwise, waits for response from pairwise,
    #  does some work to add ip address and click information to csv file, store in public/
    #  create delayed job to delete file in 3 days, sends email to user with link

    if type.nil?
      render :text => "An error has occured! Please try again later." and return
    else
      question = @earl.question

      o = [('a'..'z'), ('A'..'Z')].map { |i| i.to_a }.flatten
      randstring = (0...4).map { o[rand(o.length)] }.join
      export_key  = "wikisurvey_#{@earl.question_id}_#{type.gsub("_", "")}_#{Time.now.utc.iso8601}_#{randstring}"

      question.post(:export, :type => type, :key => export_key)

      Delayed::Job.enqueue MungeAndNotifyJob.new(@earl.id, type, current_user.email, @photocracy, export_key), 15
    end



    response = "You have requested a data export of all #{params[:type]}. Our servers are hard at work compiling the necessary data right now. You should receive an email at #{current_user.email} with a link to your data export when the file is ready. Please be patient, this process can take up to an hour, depending on how much information is requested and how busy our servers are."

    render :text => response
    #send_data(csv_data,
    #    :type => 'text/csv; charset=iso-8859-1; header=present',
    #    :disposition => "attachment; filename=#{outfile}")

  end

  def about
    @earl = Earl.find_by_name!(params[:id].to_s)
    @question = @earl.question
  end

  def add_photos
    @earl = Earl.find_by_name!(params[:id].to_s)
    @question = @earl.question
  end

  def intro
    @earl = Earl.find_by_name!(params[:id].to_s)
  end

  # necessary because the flash isn't sending AUTH_TOKEN correctly for some reason
  protect_from_forgery :except => [:upload_photos]
  def upload_photos
    @earl = Earl.find_by_name!(params[:id].to_s)

    new_photo = Photo.create(:image => params[:Filedata], :original_file_name => params[:Filedata].original_filename)
    if new_photo.valid?
      choice_params = {
        :visitor_identifier => params[:session_identifier],
        :data => new_photo.id,
        :question_id => @earl.question_id,
        :active => true
      }


      choice = Choice.create(choice_params)
    end

    if new_photo.valid? && choice.valid?
      render :text => "yeah!"
    else
      render :text => 'Choice creation failed', :status => 500
    end
  end

  def visitor_voting_history
    @votes = Session.new(:id => @survey_session.session_id).get(:votes, :question_id => params[:id])

    if @photocracy
      @votes['votes'].each do |vote|
        vote[:left_choice_thumb]  = Photo.find(vote['left_choice_data']).image.url(:thumb)
        vote[:right_choice_thumb] = Photo.find(vote['right_choice_data']).image.url(:thumb)
      end
    end
    render :json => @votes.to_json
  end

  # we use this as a basic sanity check that the site is working
  # pass in a Earl.name in the URL (e.g., /status/test_icecream) to find that earl and related
  # question and choices.
  # if any of these tests fail then we send a 503 status code, which will trigger an error via
  # EngineYard's monitoring system if it is configured to check this URL.
  def status
    # verify that there are no jobs that should have been run 20 minutes
    # that still have not been started or attempted
    @no_jobs_20_minutes_old = Delayed::Job.count(:conditions =>
      ["locked_at IS NULL AND failed_at is NULL AND run_at <= ?", Delayed::Job.db_time_now - 20.minutes]
    ) == 0

    begin
      earl = Earl.find(params[:id])
    rescue
    end
    @can_find_earl = earl != nil

    begin
      question = earl.question
    rescue
    end
    @can_find_question = question.class == Question

    if @can_find_question
      begin
        choices = Choice.find(:all, :params => {:question_id => question.id, :limit => 1})
      rescue
      end
      @can_find_choices = choices.class == Array
    else
      @can_find_choices = false
    end

    status = (@no_jobs_20_minutes_old && @can_find_earl && @can_find_question && @can_find_choices) ? :ok : :service_unavailable
    logger.info "STATUS: can_find_earl: #{@can_find_earl}, can_find_question: #{@can_find_question}, can_find_choices: #{@can_find_choices}, no_jobs_20_minutes_old: #{@no_jobs_20_minutes_old}"
    render 'questions/status', :status => status
  end

  private
    def object_info_to_hash(array)
      hash = {}
      array.each do |a|
        hash[a["visitor_id"]] = a["count"]
      end
      return hash
    end
end
