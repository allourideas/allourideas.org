class AbingoDashboardController < ApplicationController
      before_filter :admin_only
      
      def index
        @experiments = Abingo::Experiment.all
      end

      def show
	@experiment = Abingo::Experiment.find(params[:id], :include => :alternatives)

	#This is a really convoluted way to do it, but there seems to be problems in rails
	# when you try to associate a gem class with a model class. 
	
	admin_users = User.find(:all, :conditions => {:admin => true})

	admin_user_list = admin_users.inject([]){|list, u| list << u.id}

	logger.info(@experiment.inspect)

	# Make a list of sessions we are interested in to get info from the server
	session_list = []
	@experiment.alternatives.each do |alt|
		alt.session_infos.each do |sess|
			if sess.user_id and admin_user_list.include?(sess.user_id)
				next
			else
			 	session_list << sess.session_id
			end
		end
	end
	#this is to check for irregularities that I believe will be solved by redis
	origsize = session_list.size

	session_list.uniq!

	if origsize != session_list.size
		flash[:notice] = "Warning: Experiment #{@experiment.id} has duplicate session ids"
	end

	# Get the list from the server
	# The Session class uses json for simplicity, we need to do some parsing here
	# It's important that we send parameters in the body here, otherwise some undefined behavior occurs
	# when the URI gets too long
	theresponse = Session.post(:votes_by_session_ids, {}, {:session_ids => session_list}.to_json)
	@votes_by_session_ids = JSON.parse(theresponse.body) 
	@voter_distribution = Hash.new(0)

	# Format our info from the server into a distribution table
	@experiment.alternatives.each do |a|
		@voter_distribution[a.id] = Hash.new(0)
		a.session_infos.each do |s|
			if s.user_id and admin_user_list.include?(s.user_id)
				next
			end

			num_votes = @votes_by_session_ids[s.session_id]
			if num_votes
				@voter_distribution[a.id][num_votes] +=1
			else
				@voter_distribution[a.id][0] +=1
		        end	
		end
	end

	# Calculate some summary stats
	
	@summary_stats=Hash.new(0)
	@experiment.alternatives.each do |a|
		@summary_stats[a.id] = Hash.new(0)
		votes_for_median =[]
		@voter_distribution[a.id].each do |num_votes, num_sessions|
		     @summary_stats[a.id][:total_votes] += num_votes
		     @summary_stats[a.id][:total_sessions] += num_sessions

		     num_sessions.times do 
			     votes_for_median << num_votes
		     end

		end
		total = @summary_stats[a.id][:total_sessions].to_f
		@summary_stats[a.id][:percent_of_sessions_greater_than_0_votes] = ((total - @voter_distribution[a.id][0]).to_f / total) * 100
		@summary_stats[a.id][:mean_votes] = @summary_stats[a.id][:total_votes].to_f/ @summary_stats[a.id][:total_sessions].to_f
		@summary_stats[a.id][:median_votes] = median(votes_for_median)

		@summary_stats[a.id][:mean_votes_of_voters] = @summary_stats[a.id][:total_votes].to_f/ (@summary_stats[a.id][:total_sessions] - @voter_distribution[a.id][0]).to_f
		@summary_stats[a.id][:median_votes_of_voters] = median(votes_for_median-[0])
	end

 	#Now that we have the data, format into a pretty graph	
	series = []
	@experiment.alternatives.each do |a|
		series << { :name => "Alternative - #{a.content}",
			    :type => 'spline',
			    :data => @voter_distribution[a.id].sort, # creates an array sorted by key
		}
	end

	tooltipformatter = "function() { return '<b>' + this.series.name + '</b> <br>' + this.y + ' Sessions voted ' + this.x +' times '; }"

        @vote_distribution_chart = Highchart.spline({
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
      
      def end_experiment
        @alternative = Abingo::Alternative.find(params[:id])
        @experiment = Abingo::Experiment.find(@alternative.experiment_id)
        if (@experiment.status != "Completed")
          @experiment.end_experiment!(@alternative.content)
          flash[:notice] = "Experiment marked as ended.  All users will now see the chosen alternative."
        else
          flash[:notice] = "This experiment is already ended."
        end
        redirect_to :action => "index"
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
      
end

