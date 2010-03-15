class QuestionsController < ApplicationController
  include ActionView::Helpers::TextHelper
  require 'crack'
  require 'geokit'
  before_filter :authenticate, :only => [:admin, :toggle, :toggle_autoactivate, :update, :delete_logo, :export]
  #caches_page :results
  
  # GET /questions
  # GET /questions.xml
  def index
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    @questions = Question.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @questions }
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
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    logger.info "@question = Question.find_by_name(#{params[:id]}) ..."
    @question = Question.find_by_name(params[:id], true)
    @question_id = @question.id
    @earl = Earl.find params[:id]
    logger.info "@question is #{@question.inspect}."
    @partial_results_url = "#{@earl.name}/results"
    if params[:all]
      @choices = Choice.find(:all, :params => {:question_id => @question_id})
    else
      @choices = Choice.find(:all, :params => {:question_id => @question_id, :limit => 10, :offset => 0})
    end
    logger.info "First choice is #{@choices.first.inspect}"
    
    @available_charts = {}
    @available_charts['votes'] = { :title => "Number of votes over time"}
    @available_charts['user_submitted_ideas'] = { :title => "Number of submitted idea over time"}
    @available_charts['user_sessions'] = { :title => "Number of unique user sessions per day"}
  end
  
  def admin
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    logger.info "@question = Question.find_by_name(#{params[:id]}) ..."
    @earl = Earl.find params[:id]

    unless ((current_user.owns?(@earl)) || current_user.admin?)
	    logger.info ("Current user is: #{current_user.inspect}")
	    flash[:notice] = "You are not authorized to view that page"
	    redirect_to( "/#{params[:id]}") and return
    end

    @question = Question.find_by_name(params[:id])
    logger.info "@question is #{@question.inspect}."
    logger.info "@earl is #{@earl.inspect}."
    @partial_results_url = "#{@earl.name}/results"
    @choices = Choice.find(:all, :params => {:question_id => @question.id, :include_inactive => true})
    logger.info "First choice is #{@choices.first.inspect}"

     
end

  def word_cloud
     @earl = Earl.find params[:id]
     type = params[:type]
      
     ignore_word_list = %w( a an and is or the of for in to with on) 
     @word_frequency = Hash.new(0)
     @choices = Choice.find(:all, :params => {:question_id => @earl.question_id})

     min_val = nil
     @choices.each do|c|
	    if c.data
		 c.data.split(" ").each do|word|
		   word.downcase!
	           if ignore_word_list.include?(word)
			   next
		   end
		   if type == "weight_by_score"
		      @word_frequency[word] += c.score.to_i
		      min_val = c.score if min_val.nil? || c.score < min_val
		   else
	              @word_frequency[word] +=1
		      min_val = 1 if min_val.nil?
		   end
		 end
	    end
      end


      @word_frequency.delete_if { |word, score| score <= min_val}

       target_div = 'wcdiv'
       if type
	       target_div+= "-" + type
       end

     @word_cloud_js ="
        var thedata = new google.visualization.DataTable();
        thedata.addColumn('string', 'Label');
        thedata.addColumn('number', 'Value');
        thedata.addColumn('string', 'Link'); //optional link
        thedata.addRows(#{@word_frequency.size});
"
     @word_cloud_end = "
        var outputDiv = document.getElementById('#{target_div}');
        var tc = new TermCloud(outputDiv);
        tc.draw(thedata, null);
       "


	respond_to do |format|
	format.html
	format.js
        end
    end



  def voter_map
     logger.info "@question = Question.find_by_name(#{params[:id]}) ..."
     type = params[:type]

     if type == "all"
	 votes_by_sids = Question.get(:all_num_votes_by_visitor_id)
     else
         @earl = Earl.find params[:id]
         @question = Question.find_by_name(params[:id])
         votes_by_sids = @question.get(:num_votes_by_visitor_id)
     end
     
     @votes_by_geoloc= {}
     votes_by_sids.each do|sid, num_votes|
	     num_votes = num_votes.to_i
	     session = SessionInfo.find_by_session_id(sid)

	     if session.nil? || session.ip_addr.nil?
	        logger.info("could not find locally:::SID #{sid} ::::::#{num_votes}\n")
	        if @votes_by_geoloc["Unknown Location"].nil?
	          @votes_by_geoloc["Unknown Location"] = {}
	          @votes_by_geoloc["Unknown Location"][:num_votes] = num_votes
	        else @votes_by_geoloc["Unknown Location"].nil?
	          @votes_by_geoloc["Unknown Location"][:num_votes] += num_votes
		end

		next
	     end

	     if session.loc_info.empty?
	      loc = Geokit::Geocoders::MultiGeocoder.geocode(session.ip_addr)
	      if loc.success
		session.loc_info= {}
		session.loc_info[:city] = loc.city
		session.loc_info[:state] = loc.state
		session.loc_info[:country] = loc.country
		session.loc_info[:lat] = loc.lat
		session.loc_info[:lng] = loc.lng
		session.save
	      end
	     end
	     
	     if !session.loc_info.empty?
		display_fields = [:city, :state, :country]

		display_text = []
		display_fields.each do|key|
			if session.loc_info[key]:
				display_text << session.loc_info[key] 
			end
		end

	     	city_state_string = display_text.join(", ")
	        if @votes_by_geoloc[city_state_string].nil?
	          @votes_by_geoloc[city_state_string] = {}
	          @votes_by_geoloc[city_state_string][:lat] = session.loc_info[:lat]
	          @votes_by_geoloc[city_state_string][:lng] = session.loc_info[:lng]
	          @votes_by_geoloc[city_state_string][:num_votes] = num_votes
	        else
		  @votes_by_geoloc[city_state_string][:num_votes] += num_votes
	        end
	     else
	        logger.info("could not find locally111:::SID #{sid} ::::::#{num_votes}\n")
	        if @votes_by_geoloc["Unknown Location"].nil?
	          @votes_by_geoloc["Unknown Location"] = {}
	          @votes_by_geoloc["Unknown Location"][:num_votes] = num_votes
	        else @votes_by_geoloc["Unknown Location"].nil?
	          @votes_by_geoloc["Unknown Location"][:num_votes] += num_votes
		end
	     end
     end

     respond_to do |format|
	format.html {render :layout => false}
        format.js
     end 
  end

  def scatter_plot_user_vs_seed_ideas
      type = params[:type] # should be scatter_ideas
      @earl = Earl.find params[:id]
      @choices = Choice.find(:all, :params => {:question_id => @earl.question_id, :include_inactive => true})

      chart_data = []
      @choices.each do |c|
	      point = {}
	      point[:name] = c.data.strip.gsub("'", "")
	      point[:x] = c.score
	      point[:y] = c.attributes['user_created'] ? 1 : 0
	      chart_data << point
      end
      
      tooltipformatter = "function() { return '<b>' + this.point.name + '</b>: '+ this.x +' '+ this.y ; }"
      @votes_chart = Highchart.spline({
	    :chart => { :renderTo => "#{type}-chart-container",
		    	:margin => [50, 25, 60, 80],
			:borderColor =>  '#919191',
			:borderWidth =>  '1',
			:borderRadius => '0',
			:backgroundColor => '#FFFFFF'
		      },
	    :legend => { :enabled => false },
            :title => { :text => "Scores of User submitted and Seeded Ideas", 
		     	:style => { :color => '#919191' }
		      },
	    :x_axis => { :min => '0', :max => '100', :type => 'linear', :title => {:enabled => true, :text => "Score Value"}},
	    :y_axis => { :categories => ['Seed Ideas', 'User Ideas'], 
		    	 :title => {:text => "Idea Type" , :style => { :color => '#919191'}}},
	    :series => [ { :name => "#{type.gsub("_", " ").capitalize}",
			   :type => 'scatter',
			   :color => 'rgba( 145,145,145, .5)',
	                   :data => chart_data }],
	    :tooltip => { :formatter => tooltipformatter }

      })
     
      respond_to do |format|
	format.js { render :text => @votes_chart }
     end

  end




  def timeline_graph
      totals = params[:totals]
      type = params[:type]

      if !totals || totals != "true"
        @earl = Earl.find params[:id]
        @question = @earl.question(true)
      end
      
      if type == 'votes'
	 if totals == "true"
             votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'votes')
	 else
             votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'votes')
	 end
         chart_title = "Number of Votes per day"
         y_axis_title = "Number of Votes"
      elsif type == 'user_sessions'
	 if totals == "true"
             votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'user_sessions')
	 else
             votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'user_sessions')
	 end
         chart_title = "Number of User sessions per day"
         y_axis_title = "Number of Sessions"
      elsif type == 'user_submitted_ideas'
	 if totals == "true"
             votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'user_submitted_ideas')
	 else
             votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'user_submitted_ideas')
	 end
         chart_title = "Number of Ideas submitted per day"
         y_axis_title = "Number of Ideas"
      elsif type == 'unique_users'
	 if totals == "true"
                 chart_title = "Number of Unique Users per day"
                 y_axis_title = "Number of Users per day"
		 result = SessionInfo.find(:all, :select => 'date(created_at) as date, visitor_id, count(*) as session_id_count', :group => 'date(created_at), visitor_id')
		 votes_count_hash = Hash.new(0)

		 result.each do |r|
			 votes_count_hash[r.date.to_s.gsub('-','_')] +=1
		 end
	 end

      end

      if votes_count_hash == "\n"
	render :text => "$('\##{type}-chart-container').text('Cannot make chart, no data.');" and return
      end

      votes_count_hash = votes_count_hash.sort
      chart_data =[]
      start_date = nil
      current_date = nil
      votes_count_hash.each do |hash_date_string, votes|

	    hash_date = Date.strptime(hash_date_string, "%Y_%m_%d")
	    if start_date.nil?
		    start_date = hash_date
		    current_date= start_date
	    end

	    # We need to add in a blank entry for every day that doesn't exist
	    while current_date != hash_date do
		    chart_data << 0
		    current_date = current_date + 1
	    end
	    chart_data  << votes
	    current_date = current_date + 1
      end
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
            :title => { :text => chart_title + " - Overall total: #{overalltotal}",
		     	:style => { :color => '#919191' }
		      },
	    :x_axis => { :type => 'datetime', :title => {:text => "Date"}},
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
	format.js { render :text => @votes_chart }
     end
  end
	
  
  def vote(direction)
    expire_page :action => :results

    bingo!("voted")
    prompt_id = session[:current_prompt_id]
    logger.info "Getting ready to vote left on Prompt #{prompt_id}, Question #{params[:id]}"
    @prompt = Prompt.find(prompt_id, :params => {:question_id => params[:id]})
    case direction
    when :left
      winner, loser = @prompt.left_choice_text, @prompt.right_choice_text
      conditional = p = @prompt.post(:vote_left, :params => {'auto' => request.session_options[:id]})
    when :right
      loser, winner = @prompt.left_choice_text, @prompt.right_choice_text
      conditional = p = @prompt.post(:vote_right, :params => {'auto' => request.session_options[:id]})
    else
      raise "unspecified choice"
    end
    session[:has_voted] = true
    logger.info "winnder [sic] was #{winner}, loser is #{loser}"
    logger.info "prompt was #{@prompt.inspect}"
    respond_to do |format|
        format.xml  {  head :ok }
        format.js  { 
          if conditional
            #flash[:notice] = 'Vote was successfully counted.'
            newprompt = Crack::XML.parse(p.body)['prompt']
            logger.info "newprompt is #{newprompt.inspect}"
            session[:current_prompt_id] = newprompt['id']
            #@newprompt = Question.find(params[:id])
            render :json => {:votes => 20, :newleft => truncate((newprompt['left_choice_text']), :length => 137), 
                             :newright => truncate((newprompt['right_choice_text']), :length => 137)
                             }.to_json
          else
            render :json => '{"error" : "Vote failed"}'
          end
          }
      end
  end
  
  def vote_left
    expire_page :action => :results
    vote(:left)
  end
  
  def vote_right
    expire_page :action => :results
    vote(:right)
  end
    
  def skip
    expire_page :action => :results
    prompt_id = session[:current_prompt_id]
    logger.info "Getting ready to skip out on Prompt #{prompt_id}, Question #{params[:id]}"
    @prompt = Prompt.find(prompt_id, :params => {:question_id => params[:id]})
    #raise Prompt.find(:all).inspect
    respond_to do |format|
        flash[:notice] = 'You just skipped.'
        format.xml  {  head :ok }
        format.js  { 
          if p = @prompt.post(:skip, :params => {'auto' => request.session_options[:id]})
            newprompt = Crack::XML.parse(p.body)['prompt']
            session[:current_prompt_id] = newprompt['id']
            @newprompt = Question.find(params[:id])
            render :json => {:votes => 20, :newleft => truncate(h(newprompt['left_choice_text']), :length => 137), :newright => truncate(h(newprompt['right_choice_text']), :length => 137)}.to_json
          else
            render :json => '{"error" : "Skip failed"}'
          end
          }
      end
    end

    def add_idea
      prompt_id = session[:current_prompt_id]
      logger.info "Getting ready to add an idea while viewing on Prompt #{prompt_id}, Question #{params[:id]}"
      new_idea_data = params[:new_idea]
      @choice = Choice.new(:data => new_idea_data)
      respond_to do |format|
          #flash[:notice] = 'You just added an idea for people to vote on.'
          format.xml  {  head :ok }
          format.js  { 
            the_params = {'auto' => request.session_options[:id], :data => new_idea_data, :question_id => params[:id]}
            the_params.merge!(:local_identifier => current_user.id) if signed_in?
            if p = Choice.post(:create_from_abroad, :question_id => params[:id], :params => the_params)
              logger.info "just posted to 'create from abroad', response pending"
              newchoice = Crack::XML.parse(p.body)['choice']
              logger.info "response is #{newchoice.inspect}"
              @question = Question.find(params[:id])
              render :json => {:votes => 20,
                               :choice_status => newchoice['choice_status'], 
                               :message => "You just added an idea for people to vote on: #{new_idea_data}"}.to_json
              case newchoice['choice_status']
              when 'inactive'
                ::IdeaMailer.deliver_notification @question.creator, @question, params[:id], new_idea_data, newchoice['saved_choice_id'] #spike
              when 'active'
                ::IdeaMailer.deliver_notification_for_active @question.creator, @question, params[:id], new_idea_data, newchoice['saved_choice_id']
              end
              #notification(user, question, question_id, choice, choice_id)
            else
              render :json => '{"error" : "Addition of new idea failed"}'
            end
            }
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
              verb = @earl.active ? 'Activated' : 'Deactivated'
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
        @earl = Earl.find_by_question_id(params[:id])
	@question = @earl.question
        unless current_user.owns? @earl
          render(:json => {:message => "Succesfully changed settings, #{params[:id]}"}.to_json) and return
        end
        logger.info "Getting ready to change idea autoactivate status of Question #{params[:id]} to #{!@question.it_should_autoactivate_ideas?}"
        
        respond_to do |format|
            format.xml  {  head :ok }
            format.js  { 
	      logger.info("Question is: #{@question.inspect}")
              new_activate_val = !(@question.it_should_autoactivate_ideas)
              verb = new_activate_val ? 'Enabled' : 'Disabled'
	      logger.info("Question is: #{@question.inspect}")
              if @question.put(:set_autoactivate_ideas_from_abroad, :question => { :it_should_autoactivate_ideas => new_activate_val}) 
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
    if signed_in?
      @registered = true
    end

    @question = Question.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @question }
    end
  end

  # GET /questions/1/edit
  def edit
    #@question = Question.find(params[:id])
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
    #raise params[:question].inspect
    # 
    # @question = Question.new(params[:question].except('url').merge('visitor_identifier' => request.session_options[:id], 
    #                                                                 :ideas => params[:question]['question_ideas']))
    @question = Question.new(params[:question])
    #raise @question.inspect
    @question.validate_me
    unless @question.valid?
    	if signed_in?
      	   @registered = true
        end
      render :action => "new" and return
    end
    
    just_registered = true
    unless signed_in?
       logger.info "not signed in, getting ready to instantiate a new user from params in Questions#create"
      #try to register the user before adding the question
      @user = ::User.new(:email => params[:question]['email'], 
                         :password => params[:question]['password'], 
                         :password_confirmation => params[:question]['password'])
       unless @user.valid?
         flash[:registration_error] = "Sorry, we couldn't register you."
         #redirect_to 'questions/new' and return
         logger.info "Registration failed, here's the flash: #{flash.inspect}"
         render :action => "new" and return
       end
      if @user.save
        logger.info "just saved the user in Questions#create"
        sign_in @user
        just_registered = true
      else
        flash[:notice] = "Sorry, we couldn't register you."
        render :action => "new" and return
        #render :template => 'users/new' and return
      end
    end
    #at this point you have a current_user.  if you didn't, we would have redirected back with a validation error.
    
    @question_two = Question.new(params[:question].except('url').merge({'local_identifier' => current_user.id, 'visitor_identifier' => request.session_options[:id], :ideas => params[:question]['question_ideas']}))
    logger.info "question pre-save is #{@question.inspect}"
    respond_to do |format|
      retryable(:tries => 5) do
        if @question_two.save
          @question = @question_two
          earl = current_user.earls.create(:question_id => @question.id, :name => params[:question]['url'].strip)
          logger.info "Question was successfully created."
          session[:standard_flash] = "Congratulations. You are about to discover some great ideas.<br /> Send out your URL: #{@question.fq_earl} and watch what happens. <br /> You can further customize this site by following this link: <a href=\"#{@question.fq_earl}/admin\"> Manage this page </a>"
          ::ClearanceMailer.deliver_confirmation(current_user, @question.fq_earl) if just_registered
          format.html { redirect_to(@question.earl + "?just_created=true") }
          format.xml  { render :xml => @question, :status => :created, :location => @question }
        else
          logger.info "Question was not successfully created."
          format.html { render :action => "new" }
          format.xml  { render :xml => @question.errors, :status => :unprocessable_entity }
        end
      end
    end
  end

  # # PUT /questions/1
  # # PUT /questions/1.xml
  def update
     @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
     @question = Question.find_by_name(params[:id])
     @earl = Earl.find params[:id]
     
     unless ( (current_user.owns? @earl) || current_user.admin?)
	    flash[:notice] = "You are not authorized to view that page"
	    redirect_to( {:action => :show, :controller => :earls},  :id=> params[:id]) and return
     end

     @partial_results_url = "#{@earl.name}/results"
     @choices = Choice.find(:all, :params => {:question_id => @question.id, :include_inactive => true})
     respond_to do |format|
        if @earl.update_attributes(params[:earl])

	    logger.info("Saving new information on earl")
	    flash[:notice] = 'Question settings saved successfully!'
	    logger.info("Saved new information on earl")
	    format.html {redirect_to :action => "admin"}
  	    # format.xml  { head :ok }
	else 
	    format.html { render :action => "admin"}
  	    #format.xml  { render :xml => @question.errors, :status => :unprocessable_entity }
        end
     end
  end
  def delete_logo
     @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
     @earl = Earl.find params[:id]
    
     unless ((current_user.owns?(@earl)) || current_user.admin? )
	    logger.info ("Current user is: #{current_user.inspect}")
	    flash[:notice] = "You are not authorized to view that page"
	    redirect_to( "/#{params[:id]}") and return
    end
     @question = Question.find_by_name(params[:id])
     
     @earl.logo = nil
     respond_to do |format|
        if @earl.save

	    logger.info("Deleting Logo from earl")
	    flash[:notice] = 'Question settings saved successfully!'
	    format.html {redirect_to :action => "admin"}
  	    # format.xml  { head :ok }
	else 
	    format.html { render :action => "admin"}
  	    #format.xml  { render :xml => @question.errors, :status => :unprocessable_entity }
        end

     end
  end
  
  def export

    @earl = Earl.find params[:id]
    unless ((current_user.owns?(@earl)) || current_user.admin? )
       flash[:notice] = "You are not authorized to export data"
       redirect_to( {:action => :show, :controller => :earls},  :id=> params[:id]) and return
    end
    @question = Question.find_by_name(params[:id])

    case params[:type]
       when "votes" then 
	   outfile = "ideamarketplace_#{@question.id}_votes_" + Time.now.strftime("%m-%d-%Y") + ".csv"
	   post_response = @question.post(:export, :type => :votes)
	   csv_data = post_response.body
       when "items"  then 
	   outfile = "ideamarketplace_#{@question.id}_ideas_" + Time.now.strftime("%m-%d-%Y") + ".csv"
	   post_response = @question.post(:export, :type => :items)
	   csv_data = post_response.body
    end

    send_data(csv_data,
        :type => 'text/csv; charset=iso-8859-1; header=present',
        :disposition => "attachment; filename=#{outfile}")

  end


  # 
  # # DELETE /questions/1
  # # DELETE /questions/1.xml
  # def destroy
  #    @question = Question.find_by_name(params[:id])
  #   @question.destroy
  # 
  #   respond_to do |format|
  #     format.html { redirect_to(questions_url) }
  #     format.xml  { head :ok }
  #   end
  # end
end
