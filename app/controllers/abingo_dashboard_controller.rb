class AbingoDashboardController < ApplicationController
  action_filter :admin_only

  caches_action :show_set, :layout => false

  def index
    if params[:all]
       @experiments = Abingo::Experiment.all
    else
       @experiments = Abingo::Experiment.paginate :page => params[:page], :order => 'created_at DESC'
    end
  end

  ## group results from all wiki surveys
  def show_groups
    @grouped_experiments = group_experiments(Abingo::Experiment.all)
  end

  def show_set
    @grouped_experiments = group_experiments(Abingo::Experiment.all)
    ids = @grouped_experiments[params[:id]]

    @experiments = Abingo::Experiment.find(ids, :include => :alternatives)
    admin_users = User.select('id').where(:admin => true)
    admin_user_list = admin_users.map{|u| u.id}
    session_list = get_session_list(@experiments, admin_user_list)
    session_ids = session_list.map{|s| s['session_id'] }

    theresponse = Session.post(:objects_by_session_ids, {}, {:session_ids => session_ids}.to_json)
    @objects_by_session_ids = JSON.parse(theresponse.body)

    distributions = get_distributions(session_list, @objects_by_session_ids, @experiments.first.alternatives)
    @voter_distribution = distributions[0]
    @uploader_distribution = distributions[1]

    @summary_stats = calculate_summary_stats(@experiments.first, @voter_distribution, @uploader_distribution)
    @vote_distribution_chart = create_voter_distribution_chart(@experiments.first, @voter_distribution)
    @experiment = @experiments.first
    # change title to make it a bit prettier on display
    @experiment.test_name = "#{ids.size} experiments aggregated together"
    render :action => :show
    if ActionController::Base.perform_caching
      cache_key = 'views' + url_for(:controller => :abingo_dashboard, :action => 'show_set', :id => params[:id]).gsub(/^h.+:\//, '')
      ActionController::Base.cache_store.delay(:run_at => Time.now.utc + 1.day).delete(cache_key)
    end
  end

  def show
    @experiment = Abingo::Experiment.find(params[:id], :include => :alternatives)

    admin_users = User.select('id').where(:admin => true)
    admin_user_list = admin_users.map{|u| u.id}
    session_list = get_session_list(@experiment, admin_user_list)
    session_ids = session_list.map{|s| s['session_id'] }

    # Get the list from the server
    # The Session class uses json for simplicity, we need to do some parsing here
    # It's important that we send parameters in the body here, otherwise some undefined behavior occurs
    #          when the URI gets too long
    theresponse = Session.post(:objects_by_session_ids, {}, {:session_ids => session_ids}.to_json)
    @objects_by_session_ids = JSON.parse(theresponse.body)

    distributions = get_distributions(session_list, @objects_by_session_ids, @experiment.alternatives)
    @voter_distribution = distributions[0]
    @uploader_distribution = distributions[1]

    # Calculate some summary stats
    @summary_stats = calculate_summary_stats(@experiment, @voter_distribution, @uploader_distribution)

    #Now that we have the data, format into a pretty graph

    @vote_distribution_chart = create_voter_distribution_chart(@experiment, @voter_distribution)
  end

  def end_experiment
    @alternative = Abingo::Alternative.find(params[:id])
    @experiment = Abingo::Experiment.find(@alternative.experiment_id)
    if (@experiment.status != "Completed")
      @experiment.end_experiment!(@alternative.content)
      flash[:notice] = "Experiment marked as ended.  All users will now see the chosen alternative."
    else
      flash[:notice] = "This experiment is already ended."
    end
    redirect_to :action => "index" and return
  end

  def mean(array)
    array.inject(0) { |sum, x| sum += x } / array.size.to_f
  end

  def median(array, already_sorted=false)
    return nil if array.empty?
    array = array.sort unless already_sorted
    m_pos = array.size / 2
    return array.size % 2 == 1 ? array[m_pos] : mean(array[m_pos-1..m_pos])
  end

  private

  def group_experiments(experiments)
    grouped_experiments = Hash.new()

    experiments.each do |e|
      if e.test_name =~ /^.*test_icecream.*$/
        next
      end
      if e.test_name =~ /^.*_\d{1,5}_(.*)/
        potential_group = $1
      # group tests together by having "test_name|#{earl.name}"
      elsif e.test_name =~ /^(.*?)\|/
        potential_group = $1
      elsif e.test_name =~ /^bg_color_aa_/
        potential_group = 'bg_color_aa'
      else
        potential_group = "unknown"
      end
      grouped_experiments[potential_group] = [] unless grouped_experiments.has_key?(potential_group)
      grouped_experiments[potential_group] << e.id
    end

    grouped_experiments
  end

  def get_session_list(experiment, admin_user_list)
    if experiment.class == Array
      experiment_ids = experiment.map{|e| e.id}
    else
      experiment_ids = [experiment.id]
    end
    sql = "SELECT DISTINCT(s.session_id), a.content
            FROM `experiments` e
            LEFT JOIN `alternatives` a ON (a.experiment_id = e.id)
            LEFT JOIN `trials` t ON (t.alternative_id = a.id)
            LEFT JOIN `session_infos` s ON (s.id = t.session_info_id)
            WHERE e.id IN (#{experiment_ids.join(",")})
            AND s.session_id IS NOT NULL
            AND (s.user_id NOT IN (#{admin_user_list.join(",")}) OR s.user_id IS NULL)"
    Abingo::Experiment.connection.select_all(sql)
  end

  def get_distributions(session_list, objects_by_session_ids, alternatives)
    voter_distribution = {}
    uploader_distribution = {}
    alternatives.each do |a|
      voter_distribution[a.content] = Hash.new(0)
      uploader_distribution[a.content] = Hash.new(0)
    end
    session_list.each do |s|
      sess = objects_by_session_ids[s['session_id']]
      if sess.nil?
        num = 0
      else
        num  = sess['votes']
      end
      voter_distribution[s['content']][num.to_i] +=1

      sess = objects_by_session_ids[s['session_id']]
      if sess.nil?
        num = 0
      else
        num  = sess['ideas']
      end
      uploader_distribution[s['content']][num.to_i] +=1
    end
    [voter_distribution, uploader_distribution]
  end

  def calculate_summary_stats(experiment, voter_distribution, uploader_distribution)
    summary_stats=Hash.new(0)
    experiment.alternatives.each do |a|
      summary_stats[a.content] = Hash.new(0)
      votes_for_median =[]
      voter_distribution[a.content].each do |num_votes, num_sessions|
        summary_stats[a.content][:total_votes] += num_votes * num_sessions
        summary_stats[a.content][:total_sessions] += num_sessions

        num_sessions.times do
          votes_for_median << num_votes
        end
      end

      uploader_distribution[a.content].each do |num_ideas, num_sessions|
        summary_stats[a.content][:total_uploaded_ideas] += num_ideas * num_sessions
      end
      total = summary_stats[a.content][:total_sessions].to_f
      summary_stats[a.content][:percent_of_sessions_greater_than_0_votes] = ((total - voter_distribution[a.content][0]).to_f / total) * 100
      summary_stats[a.content][:mean_votes] = summary_stats[a.content][:total_votes].to_f/ summary_stats[a.content][:total_sessions].to_f
      summary_stats[a.content][:median_votes] = median(votes_for_median)

      summary_stats[a.content][:mean_votes_of_voters] = summary_stats[a.content][:total_votes].to_f/ (summary_stats[a.content][:total_sessions] - voter_distribution[a.content][0]).to_f
      summary_stats[a.content][:median_votes_of_voters] = median(votes_for_median-[0])

      summary_stats[a.content][:percent_of_sessions_greater_than_0_ideas] = ((total - uploader_distribution[a.content][0]).to_f / total) * 100
    end
    summary_stats
  end

  def create_voter_distribution_chart(experiment, voter_distribution)
    series = []
    experiment.alternatives.each do |a|
      series << { :name => "Alternative - #{a.content}",
                  :type => 'spline',
                  :data => voter_distribution[a.content].sort, # creates an array sorted by key
      }
    end

    tooltipformatter = "function() { return '<b>' + this.series.name + '</b> <br>' + this.y + ' Sessions voted ' + this.x +' times '; }"
    Highchart.spline({
        :chart => { :renderTo => 'votes-distribution-chart-container',
                    :zoomType => 'x'
        },
        :title => { :text => "Vote distribution by alternative" },
        :x_axis => { :type => 'linear', :title => {:text => "Number of Votes"}, :maxZoom => 5},
        :y_axis => { :min => '0', :title => {:text => "# of people who voted this many votes"}},
        :series => series,
        :tooltip => { :formatter => tooltipformatter }

    })
  end
end

