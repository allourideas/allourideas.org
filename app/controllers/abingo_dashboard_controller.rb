class AbingoDashboardController < ApplicationController
      before_filter :admin_only
      
      def index
        @experiments = Abingo::Experiment.all
      end

      def show
	@experiment = Abingo::Experiment.find(params[:id], :include => :alternatives)

	logger.info(@experiment.inspect)

	# Make a list of sessions we are interested in to get info from the server
	session_list = []
	@experiment.alternatives.each do |alt|
		alt.session_infos.each do |sess|
			session_list << sess.session_id
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
	response = Session.post(:votes_by_session_ids, :session_ids => session_list)
	@votes_by_session_ids = JSON.parse(response.body) 
	@voter_distribution = Hash.new(0)

	# Format our info from the server into a distribution table
	@experiment.alternatives.each do |a|
		@voter_distribution[a.id] = Hash.new(0)
		a.session_infos.each do |s|
			num_votes = @votes_by_session_ids[s.session_id]
			if num_votes
				@voter_distribution[a.id][num_votes] +=1
			else
				@voter_distribution[a.id][0] +=1
		        end	
		end
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
		      },
            :title => { :text => "Vote distribution by alternative" },
	    :x_axis => { :type => 'linear', :title => {:text => "Number of Votes"}},
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
end

