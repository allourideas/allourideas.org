class AbingoDashboardController < ApplicationController
      before_filter :admin_only
      
      def index
        @experiments = Abingo::Experiment.all
      end

      def show
	@experiment = Abingo::Experiment.find(params[:id], :include => :alternatives)

	logger.info(@experiment.inspect)

	session_list = []
	@experiment.alternatives.each do |alt|
		alt.session_infos.each do |sess|
			session_list << sess.session_id
		end
	end

	@votes_by_session_ids = Session.get(:votes_by_session_ids, :session_ids => session_list)
	@voter_distribution = Hash.new(0)

	@experiment.alternatives.each do |a|
		@voter_distribution[a.id] = Hash.new(0)
		a.session_infos.each do |s|
			num_votes = @votes_by_session_ids[s.session_id]
			logger.info("the num vote is the following: #{num_votes}")
			if num_votes
				@voter_distribution[a.id][num_votes] +=1
			else
				@voter_distribution[a.id][0] +=1
		        end	
		end
	end



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

