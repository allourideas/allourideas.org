namespace :clean_trials do

   task :all => [:remove_duplicate_trials]

   desc "Description here"
   task(:remove_duplicate_trials => :environment) do
		keep = []
		@trials = Trial.all

		@trials.each do |t|
			same_trials = @trials.select {|t2| t.session_info_id == t2.session_info_id and t.alternative_id == t2.alternative_id}
			keep  << same_trials.sort { |a,b| b.created_at <=> a.created_at }.first.id
		end

		keep.uniq!

		@trials.each do |t|
			t.destroy unless keep.include?(t.id)
		end



   end
end

