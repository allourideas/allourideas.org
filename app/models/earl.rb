class Earl < ActiveRecord::Base
  @@reserved_names = ["questions", "question", 'about', 'privacy', 'tour', 'no_google_tracking', 'admin', 'abingo', 'earls', 'signup', 'sign_in', 'sign_out','clicks', 'fakequestion']
  validates_presence_of :question_id, :on => :create, :message => "can't be blank"
  validates_presence_of :name, :on => :create, :message => "can't be blank"
  validates_length_of :welcome_message, :maximum=>350, :allow_nil => true, :allow_blank => true
  has_friendly_id :name, :use_slug => true, :reserved => @@reserved_names 
  has_attached_file :logo, :whiny_thumbnails => true, :styles => { :banner => "450x47>", :medium => "150x150>" }

  belongs_to :user
  
  #TODO refactor params to be an options hash
  def question(barebones = false, algorithm= "standard", visitor_identifier = nil) #including visitor_identifer creates an appearance
	  if barebones == true
	          Question.find(question_id, :params => {:barebones => true, :visitor_identifier =>  visitor_identifier})
	  elsif algorithm == "standard"
		  Question.find(question_id, :params => {:visitor_identifier => visitor_identifier})
	  elsif algorithm == "catchup"
		  logger.info("Catchup algorithm question")
		  Question.find(question_id, :params => {:algorithm => "catchup", :visitor_identifier => visitor_identifier})
	  end
    
  end

  def self.reserved_names
	  @@reserved_names
  end


  #This method will block execution until the pairwise server indicates a data export is ready
  #Thus, it should probably only be run in the background
  #TODO Add a reasonable timeout
  def export_and_notify(options = {})

	  @question = self.question
	  type = options[:type]
	  email = options[:email]

	  # delayed job doesn't like passing the user as parameter
	  # so we do this manually
	  current_user = User.find_by_email(email)

	  r = Redis.new

	  redis_key = "export_filename_notification_#{self.question_id}_#{type}_#{Time.now.to_i}_#{rand(10)}"

	  @question.post(:export, :type => type, :response_type => 'redis', :redis_key => redis_key)

	  thekey, source_filename = r.blpop(redis_key, "0")


	  dest_filename= File.join(File.expand_path(Rails.root), "public", "system", "exports", 
				   self.question_id.to_s, File.basename(source_filename))                

	  FileUtils::mkdir_p(File.dirname(dest_filename))                              
          
	  
	  #Caching these to prevent repeated lookups for the same session, Hackish, but should be fine for background job
	  @sessions = {}
	  @url_alias = {}

	  num_slugs = self.slugs.size
	  FasterCSV.open(dest_filename, "w") do |csv|
		  FasterCSV.foreach(source_filename, {:headers => :first_row, :return_headers => true}) do |row|

			  if row.header_row?
				  case type
				  when "votes", "non_votes"
					  #We need this to look up SessionInfos, but the user doesn't need to see it
					  row.delete('Session Identifier')

					  row << ['Hashed IP Address', 'Hashed IP Address']
					  row << ['URL Alias', 'URL Alias']
					  if current_user.admin?
					     row << ['Geolocation Info', 'Geolocation Info']
					  end
				  end
			          csv << row
		          else
			     case type
			     when "votes", "non_votes"

			       sid = row['Session Identifier']
			       row.delete('Session Identifier')

			       user_session = @sessions[sid]
			       if user_session.nil?
			         user_session = SessionInfo.find_by_session_id(sid)
				 @sessions[sid] = user_session
			       end

			       unless user_session.nil? #edge case, all appearances and votes after april 8 should have session info
				       # Some marketplaces can be accessed via more than one url
				       if num_slugs > 1
					       url_alias = @url_alias[sid]

					       if url_alias.nil?
						       max = 0
						       self.slugs.each do |slug|
							       num = user_session.clicks.count(:conditions => ['url like ?', '%' + slug.name + '%' ])

							       if num > max
								       url_alias = slug.name
								       max = num
							       end
						       end

						       @url_alias[sid] = url_alias
					       end
				       else
					       url_alias = self.name
				       end


				       row << ['Hashed IP Address', Digest::MD5.hexdigest([user_session.ip_addr, IP_ADDR_HASH_SALT].join(""))]
				       row << ['URL Alias', url_alias]
				       if current_user.admin?
				         row << ['Geolocation Info', user_session.loc_info.to_s]
				       end
			       end
			     end
			     csv << row

			  end
		  end
	  end
	  
	  File.send_at(3.days.from_now, :delete, dest_filename)
	  url = "/system/exports/#{self.question_id}/#{File.basename(dest_filename)}"
	  ::IdeaMailer.deliver_export_data_ready(email, url)

	  dest_filename
  end
end
