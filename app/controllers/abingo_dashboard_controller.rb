class AbingoDashboardController < ApplicationController
  before_filter :admin_only
  
  def index
    if params[:all]
       @experiments = Abingo::Experiment.all
    else
       @experiments = Abingo::Experiment.paginate :page => params[:page], :order => 'created_at DESC'
    end
  end

  ## group results from all idea marketplaces
  def show_groups
    @experiments = Abingo::Experiment.all
    
    @grouped_experiments = Hash.new()
    
    @experiments.each do |e|
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
      @grouped_experiments[potential_group] = [] unless @grouped_experiments.has_key?(potential_group)
      @grouped_experiments[potential_group] << e
    end

  end
  
  def show_set
    ids = params[:ids].class == String ? params[:ids].split(/, */).uniq : params[:ids]
    @experiments = Abingo::Experiment.find(ids, :include => :alternatives)
    session_list = []
    admin_users = User.find(:all, :conditions => {:admin => true})
    admin_user_list = admin_users.inject([]){|list, u| list << u.id}
    @experiments.each do |experiment|
      session_list += get_session_list(experiment, admin_user_list)
    end
    
    session_list.uniq!
    
    theresponse = Session.post(:objects_by_session_ids, {}, {:session_ids => session_list}.to_json)
    @objects_by_session_ids = JSON.parse(theresponse.body) 
    @voter_distribution = initialize_distribution_hash(@experiments.first)
    @uploader_distribution= initialize_distribution_hash(@experiments.first)
    
    @experiments.each do |experiment|
      add_totals_to_distribution(experiment, @voter_distribution, @objects_by_session_ids, "votes", admin_user_list)
      add_totals_to_distribution(experiment, @uploader_distribution, @objects_by_session_ids, "ideas", admin_user_list)
    end
    
    @summary_stats = calculate_summary_stats(@experiments.first, @voter_distribution, @uploader_distribution)       
    @vote_distribution_chart = create_voter_distribution_chart(@experiments.first, @voter_distribution)
    @experiment = @experiments.first
    # change title to make it a bit prettier on display
    @experiment.test_name = "#{ids.size} experiments aggregated together"
    render :action => :show
  end

  def show
    @experiment = Abingo::Experiment.find(params[:id], :include => :alternatives)
    
    admin_users = User.find(:all, :conditions => {:admin => true})
    admin_user_list = admin_users.inject([]){|list, u| list << u.id}
    # Make a list of sessions we are interested in to get info from the pairwise server
    #this is to check for irregularities that I believe will be solved by redis
    session_list = get_session_list(@experiment, admin_user_list)
    origsize = session_list.size

    session_list.uniq!

    if origsize != session_list.size
      flash[:notice] = "Warning: Experiment #{@experiment.id} has duplicate session ids"
    end

    # Get the list from the server
    # The Session class uses json for simplicity, we need to do some parsing here
    # It's important that we send parameters in the body here, otherwise some undefined behavior occurs
    #          when the URI gets too long
    theresponse = Session.post(:objects_by_session_ids, {}, {:session_ids => session_list}.to_json)
    @objects_by_session_ids = JSON.parse(theresponse.body) 
    @voter_distribution = initialize_distribution_hash(@experiment)
    @uploader_distribution= initialize_distribution_hash(@experiment)

    add_totals_to_distribution(@experiment, @voter_distribution, @objects_by_session_ids, "votes", admin_user_list) 
    add_totals_to_distribution(@experiment, @uploader_distribution, @objects_by_session_ids, "ideas", admin_user_list)      

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

  def get_session_list(experiment, admin_user_list)
    session_list = []
    experiment.alternatives.each do |alt|
      alt.session_infos.each do |sess|
        if sess.user_id and admin_user_list.include?(sess.user_id)
          next
        else
          session_list << sess.session_id
        end
      end
    end
    session_list
  end

  def initialize_distribution_hash(experiment)
    distribution = Hash.new(0)
    experiment.alternatives.each do |a|
      distribution[a.content] = Hash.new(0)
    end
    distribution
  end

  def add_totals_to_distribution(experiment, distribution, objects_by_session_ids, object_type, admin_user_list)
    experiment.alternatives.each do |a|
      a.session_infos.each do |s|
        if s.user_id and admin_user_list.include?(s.user_id)
          next
        end

        num = objects_by_session_ids[s.session_id][object_type] rescue nil
                    
        if num
          distribution[a.content][num] +=1
        else
          distribution[a.content][0] +=1
        end     
      end
    end
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

