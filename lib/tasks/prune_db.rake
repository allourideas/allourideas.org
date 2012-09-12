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

   task(:hash_ip_addresses => :environment) do
       
	counter = 0
	bad_counter = 0
        SessionInfo.all.each do |s|
	    if s.ip_addr =~ /\d+[.]\d+[.]\d+[.]\d+/
	       counter += 1
	       s.ip_addr = Digest::MD5.hexdigest([s.ip_addr, APP_CONFIG[:IP_ADDR_HASH_SALT]].join(""))
	       s.save!
	    else
	       bad_counter += 1
	       print s.ip_addr
	    end
	end

	print bad_counter
   end
end
