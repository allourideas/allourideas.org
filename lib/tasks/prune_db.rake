namespace :prune_db do
   
   task(:mark_photocracy_earls => :environment) do
	   @earls = Earl.all
	   @questions = Question.find(:all) # should only return AOI questions

	   e_question_ids = @earls.map{|e| e.question_id}
	   q_ids= @questions.map{|q| q.id}

	   photocracy_ids = e_question_ids - q_ids

	   photocracy_ids.each do |q_id|
		   e = Earl.find_by_question_id(q_id)
		   e.photocracy = true

		   e.save
	   end

   end
end
