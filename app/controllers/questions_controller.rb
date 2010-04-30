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
    if params[:locale].nil? && @earl.default_lang != I18n.default_locale.to_s
	      I18n.locale = @earl.default_lang
	      redirect_to :action => :results, :controller => :questions, :id => @earl.name and return
    end

    logger.info "@question is #{@question.inspect}."
    @partial_results_url = "#{@earl.name}/results"
    if params[:all]
      @choices = Choice.find(:all, :params => {:question_id => @question_id})
    else
      @choices = Choice.find(:all, :params => {:question_id => @question_id, :limit => 10, :offset => 0})
    end
    logger.info "First choice is #{@choices.first.inspect}"
    
    @available_charts = {}
    @available_charts['votes'] = { :title => t('results.votes_over_time_title')}
    @available_charts['user_submitted_ideas'] = { :title => t('results.user_ideas_over_time_title')}
    @available_charts['user_sessions'] = { :title => t('results.user_sessions_over_time_title')}
  end
  
  def admin
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    logger.info "@question = Question.find_by_name(#{params[:id]}) ..."
    @earl = Earl.find params[:id]

    unless ((current_user.owns?(@earl)) || current_user.admin?)
	    logger.info ("Current user is: #{current_user.inspect}")
	    flash[:notice] = t('user.not_authorized_error')
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
      
     ignore_word_list = %w( a an as and is or the of for in to with on / - &) 
     @word_frequency = Hash.new(0)
     @choices = Choice.find(:all, :params => {:question_id => @earl.question_id})

     min_val = nil
     @choices.each do|c|
	    if c.data
		 if type && type.starts_with?("uploaded")
			 unless c.user_created
				 next
			 end
		 end
		 c.data.split(" ").each do|word|
		   word.downcase!
	           if ignore_word_list.include?(word)
			   next
		   end
		   if type == "weight_by_score" || type == "uploaded_weight_by_score"
		      @word_frequency[word] += c.score.to_i
		      min_val = c.score if min_val.nil? || c.score < min_val
		   else
	              @word_frequency[word] +=1
		      min_val = 1 if min_val.nil?
		   end
		 end
	    end
      end

      if !type || !type.starts_with?("uploaded")
          @word_frequency.delete_if { |word, score| score <= min_val}
      end


       target_div = 'wcdiv'
       if type
	       target_div+= "-" + type
       end
      if @word_frequency.size ==0      
             render :text => "$('\##{target_div}').text('#{t('results.no_data_error')}');"	and return
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
	 votes_by_sids = Question.get(:all_num_votes_by_visitor_id, :scope => "all_votes")
     elsif type == "all_creators"
	 votes_by_sids = Question.get(:all_num_votes_by_visitor_id, :scope => "creators")
     elsif type == "uploaded_ideas"
         
	 @earl = Earl.find params[:id]
         @question = @earl.question(true)
	 votes_by_sids = @question.get(:object_info_by_visitor_id, :object_type => 'uploaded_ideas')
     elsif type == "bounces"
	 @earl = Earl.find params[:id]
         @question = @earl.question(true)

	 votes_by_sids = @question.get(:object_info_by_visitor_id, :object_type => 'bounces')

     elsif type == "votes"
         @earl = Earl.find params[:id]
         @question = @earl.question(true)
         votes_by_sids = @question.get(:object_info_by_visitor_id, :object_type => 'votes')
     end
     
     @votes_by_geoloc= {}
     object_total = 0
     votes_by_sids.each do|sid, num_votes|
	     num_votes = num_votes.to_i
	     session = SessionInfo.find_by_session_id(sid)

	     if type == "bounces" &&  session.clicks.size > 1
		     next
	     end

	     object_total += num_votes
	     if session.nil? || session.loc_info.nil? 
	        if @votes_by_geoloc["Unknown Location"].nil?
	          @votes_by_geoloc["Unknown Location"] = {}
	          @votes_by_geoloc["Unknown Location"][:num_votes] = num_votes
	        else 
	          @votes_by_geoloc["Unknown Location"][:num_votes] += num_votes
		end

		next
	     end

	    # if session.loc_info.empty?
	    #  loc = Geokit::Geocoders::MultiGeocoder.geocode(session.ip_addr)
	    #  if loc.success
	#	session.loc_info= {}
	#	session.loc_info[:city] = loc.city
	#	session.loc_info[:state] = loc.state
	#session.loc_info[:country] = loc.country
	#session.loc_info[:lat] = loc.lat
	#	session.loc_info[:lng] = loc.lng
	#	session.save
	#      end
	#     end
	     
	     if !session.loc_info.empty?
		display_fields = [:city, :region, :country_code]

		display_text = []
		display_fields.each do|key|
			if session.loc_info[key] && !(/^[0-9]+$/ =~ session.loc_info[key])
				display_text << session.loc_info[key] 
			end
		end

	     	city_state_string = display_text.join(", ")
	        if @votes_by_geoloc[city_state_string].nil?
	          @votes_by_geoloc[city_state_string] = {}
	          @votes_by_geoloc[city_state_string][:lat] = session.loc_info[:latitude]
	          @votes_by_geoloc[city_state_string][:lng] = session.loc_info[:longitude]
	          @votes_by_geoloc[city_state_string][:num_votes] = num_votes
	        else
		  @votes_by_geoloc[city_state_string][:num_votes] += num_votes
	        end
	     else
	        if @votes_by_geoloc["Unknown Location"].nil?
	          @votes_by_geoloc["Unknown Location"] = {}
	          @votes_by_geoloc["Unknown Location"][:num_votes] = num_votes
	        else 
	          @votes_by_geoloc["Unknown Location"][:num_votes] += num_votes
		end
	     end
     end

     case type
     when "votes" then
	    @object_type = t('common.votes')
     when "uploaded_ideas" then
	    @object_type = t('results.uploaded_ideas')
     when "bounces" then
	    @object_type = "bounces"
     when "all" then
	    @object_type = t('common.votes')
     when "all_creators" then
	    @object_type = "questions"
     end

     @total = object_total
     respond_to do |format|
	format.html {render :layout => false}
        format.js
     end 
  end

  def scatter_plot_user_vs_seed_ideas
      type = params[:type] # should be scatter_ideas
      @earl = Earl.find params[:id]
      @choices = Choice.find(:all, :params => {:question_id => @earl.question_id})

      chart_data = []
      jitter = {}
      jitter[0] = Hash.new(0)
      jitter[1] = Hash.new(0)
      @choices.each_with_index do |c, i|
	      point = {}
	      point[:name] = c.data.strip.gsub("'", "") + "@@@" + c.id.to_s
	      point[:x] = c.score.round
	      point[:y] = c.attributes['user_created'] ? 1 : 0
	      if i % 2 == 1
	        jitter[point[:y]][point[:x]] += 0.04
	      end
	      thejitter = [jitter[point[:y]][point[:x]], 0.5].min
	      if i % 2 == 0
	         point[:y] += thejitter 
	      else
	         point[:y] -= thejitter
	      end

	      chart_data << point
      end
      
      choice_url = url_for(:action => 'show', :controller => "choices", :id => 'fakeid', :question_id => @earl.name)
      tooltipformatter = "function() {  var splitresult = this.point.name.split('@@@');
                                        var name = splitresult[0];
					var id = splitresult[1];
      				        return '<b>' + name + '</b>: '+ this.x; }"

      moreinfoclickfn= "function() {  var splitresult = this.name.split('@@@');
                                        var name = splitresult[0];
					var id = splitresult[1];

					var fake_url= '#{choice_url}';
					var the_url = fake_url.replace('fakeid',id);

      				        location.href=the_url;}"
      @votes_chart = Highchart.spline({
	    :chart => { :renderTo => "#{type}-chart-container",
		    	:margin => [50, 25, 60, 100],
			:borderColor =>  '#919191',
			:borderWidth =>  '1',
			:borderRadius => '0',
			:backgroundColor => '#FFFFFF',
			:height => '500'
		      },
	    :legend => { :enabled => false },
            :title => { :text => t('results.scores_of') + " " + t('results.uploaded_ideas')+ " "+   t('common.and') +  " " + t('results.original_ideas'), 
		     	:style => { :color => '#919191' }
		      },
			      :x_axis => { :min => '0', :max => '100', :endOnTick => true, :showLastLabel => true,
				      	   :type => 'linear', 
					   :title => {:enabled => true, :text => t('common.score').titleize}},
	    :y_axis => { :categories => [t('results.original_ideas'), t('results.uploaded_ideas')], :max => 1, :min => 0},
	    :plotOptions => {:scatter => { :point => {:events => {:click => moreinfoclickfn }}}},
	    :series => [ { :name => "#{type.gsub("_", " ").capitalize}",
			   :type => 'scatter',
			   :color => 'rgba( 49,152,193, .5)',
	                   :data => chart_data }],
	    :tooltip => { :formatter => tooltipformatter }

      })
     
      respond_to do |format|
	format.js { render :text => @votes_chart }
     end

  end

  def scatter_votes_by_session
      type = params[:type] # should be scatter_votes_by_session
      @earl = Earl.find params[:id]
      @question = @earl.question(true)
      votes_by_sids = @question.get(:object_info_by_visitor_id, :object_type => 'votes')
      bounces_by_sids = @question.get(:object_info_by_visitor_id, :object_type => 'bounces')

      bounce_hash = {}
      bounces_by_sids.each do |k|
	      bounce_hash[k] = 0
      end

      votes_by_sids.merge!(bounce_hash)

      chart_data = []
      jitter = Hash.new(0)

      jitter_const = 1
      max = 0
      votes_by_sids.sort { |a,b| a[1].to_i <=> b[1].to_i}.each do |sid, votes|
	      point = {}
	      point[:x] = votes
	      max = votes.to_i if votes.to_i > max
	      point[:y] = jitter[votes] += jitter_const
	      point[:name] = sid
	      chart_data << point
      end
      
      tooltipformatter = "function() { return '<b>' + this.x + ' Votes </b>' ; }"
      @votes_chart = Highchart.scatter({
	    :chart => { :renderTo => "#{type}-chart-container",
		    	:margin => [50, 25, 60, 50],
			:borderColor =>  '#919191',
			:borderWidth =>  '1',
			:borderRadius => '0',
			:backgroundColor => '#FFFFFF'
		      },
	    :legend => { :enabled => false },
            :title => { :text => "Number of votes by session",
		     	:style => { :color => '#919191' }
		      },
	    :x_axis => { :type => 'linear', :min => 0, :max => max,
			 :title => {:enabled => true, :text => t('common.votes').titleize}},
	    :y_axis => { :min => 0, :type => 'linear' },
	    :series => [ { :name => "#{type.gsub("_", " ").capitalize}",
			   :type => 'scatter',
			   :color => 'rgba( 49,152,193, .5)',
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
         chart_title = t('results.number_of') +  t('common.votes') + t('results.per_day')
         y_axis_title = t('results.number_of') + t('common.votes')
      elsif type == 'user_sessions'
	 if totals == "true"
             votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'user_sessions')
	 else
             votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'user_sessions')
	 end
         chart_title = t('results.number_of') +  t('common.user_sessions') + t('results.per_day')
         y_axis_title = t('results.number_of') + t('common.user_sessions')
      elsif type == 'user_submitted_ideas'
	 if totals == "true"
             votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'user_submitted_ideas')
	 else
             votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'user_submitted_ideas')
	 end
         chart_title = t('results.number_of') +  t('common.ideas').titleize + t('results.per_day')
         y_axis_title = t('results.number_of') + t('common.ideas')
      elsif type == 'unique_users'
	 if totals == "true"
                 chart_title = t('results.number_of') +  t('common.users').titleize + t('results.per_day')
                 y_axis_title = t('results.number_of') + t('common.users')
		 result = SessionInfo.find(:all, :select => 'date(created_at) as date, visitor_id, count(*) as session_id_count', :group => 'date(created_at), visitor_id')
		 votes_count_hash = Hash.new(0)

		 result.each do |r|
			 votes_count_hash[r.date.to_s.gsub('-','_')] +=1
		 end
	 end

      end

      if votes_count_hash == "\n"
	render :text => "$('\##{type}-chart-container').text('#{t('results.no_data_error')}');"	and return
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
            :title => { :text => chart_title + " " +  t('results.overall_total') + overalltotal.to_s,
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

  def density_graph
      @earl = Earl.find params[:id]
      @densities = Density.find(:all, :params=> {:question_id => @earl.question_id})

      type = params[:type]

      prompt_types = ["seed_seed", "seed_nonseed","nonseed_seed","nonseed_nonseed"]

      if @densities.blank?
	render :text => "$('\##{type}-chart-container').text('Cannot make chart, no data.');" and return
      end

      chart_title = "Density of votes over time by prompt type"
      y_axis_title = "Density of votes"

      chart_data = {}
      prompt_types.each do |the_type|
	      chart_data[the_type] = []
      end

      start_date = nil
      current_date = nil
      @densities.each do |d|
	    hash_date = d.created_at.to_date

	    if start_date.nil?
		    start_date = hash_date
		    current_date= start_date
	    end

	    # We need to add in a blank entry for every day that doesn't exist
	    if d.value.nil?
	        chart_data[d.prompt_type] << 0
	    else
	        chart_data[d.prompt_type] << d.value
	    end
      end

      the_series = []

      prompt_types.each do |the_type|
	      the_series << { :name => the_type.humanize,
		              :type => 'line',
			      :pointInterval => 86400000,
			      :color => '#3198c1',
			      :pointStart => start_date.to_time.to_i * 1000,
			      :data => chart_data[the_type] }
      end
      tooltipformatter = "function() { return '<b>' + Highcharts.dateFormat('%b. %e %Y', this.x) +'</b>: '+ this.y +' '+ this.series.name }"

      @density_chart = Highchart.spline({
	    :chart => { :renderTo => "#{type}-chart-container",
		    	:margin => [50, 25, 60, 80],
			:borderColor =>  '#919191',
			:borderWidth =>  '1',
			:borderRadius => '0',
			:backgroundColor => '#FFFFFF'
		      },
	    :legend => { :enabled => true},
            :title => { :text => chart_title,
		     	:style => { :color => '#919191' }
		      },
	    :x_axis => { :type => 'datetime', :title => {:text => "Date"}},
	    :y_axis => { :min => '0', :title => {:text => y_axis_title, :style => { :color => '#919191'}}},
	    :series => the_series,
	    :tooltip => { :formatter => tooltipformatter }

      })
     respond_to do |format|
	format.js { render :text => @density_chart}
     end
  end

  def choices_by_creation_date
	  #authenticate admin only
     @earl = Earl.find params[:id]
     @question = @earl.question(true)

     appearance_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'appearances_by_creation_date')

      if appearance_count_hash == "\n"
	render :text => "$('\##{type}-chart-container').text('#{t('results.no_data_error')});"	and return
      end

      appearance_count_hash = appearance_count_hash.sort
      chart_data =[]
      date_list = []
      start_date = nil
      current_date = nil
      appearance_count_hash.each do |hash_date_string, appearances_list|

	    hash_date = Date.strptime(hash_date_string, "%Y_%m_%d")
	    if start_date.nil?
		    start_date = hash_date
		    current_date= start_date
	    end

	    # We need to add in a blank entry for every day that doesn't exist
	    while current_date != hash_date do
		    date_list << current_date
		    current_date = current_date + 1
	    end
            date_list << current_date
	    appearances_list.each do |a_hash|
		    point = {}
		    point[:x] = date_list.size - 1
		    point[:y] = a_hash['appearances']
		    point[:name] = a_hash['data'].strip.gsub("'","") + "@@@" + current_date.to_s
	    	    chart_data  << point
	    end
	    current_date = current_date + 1
      end
      tooltipformatter = "function() {  var splitresult = this.point.name.split('@@@');
                                        var name = splitresult[0];
					var date = splitresult[1];

                                        return '<b>' + name + '</b>: '+ this.y + ' Appearances<br> Created on: ' + date; }"
      @votes_chart = Highchart.spline({
	    :chart => { :renderTo => "choice-by-date-chart-container",
		    	:margin => [50, 25, 60, 100],
			:borderColor =>  '#919191',
			:borderWidth =>  '1',
			:borderRadius => '0',
			:backgroundColor => '#FFFFFF'
		      },
	    :legend => { :enabled => false },
            :title => { :text => 'Number of Appearances per Choice by creation date', 
		     	:style => { :color => '#919191' }
		      },
	    :x_axis => { :type => 'linear',  :min => -0.5, :title => {:text => "Number of days since creation",:enabled => true} },
	    :y_axis => { :type => 'linear', :min => 0, :title => {:text => 'Number of Appearances'}},
	    :series => [ { :name => "Data",
			   :type => 'scatter',
			   :color => 'rgba( 49,152,193, .5)',
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
    prompt_id = params[:prompt_id]
    appearance_lookup = params[:appearance_lookup]
    logger.info "Getting ready to vote left on Prompt #{prompt_id}, Question #{params[:id]}"
    @prompt = Prompt.find(prompt_id, :params => {:question_id => params[:id]})

    time_viewed = params[:time_viewed]
    case direction
    when :left
      winner, loser = @prompt.left_choice_text, @prompt.right_choice_text
      conditional = p = @prompt.post(:vote_left, :params => {'auto' => request.session_options[:id], 
				                             'time_viewed' => time_viewed, 
							     'appearance_lookup' => appearance_lookup })
    when :right
      loser, winner = @prompt.left_choice_text, @prompt.right_choice_text
      conditional = p = @prompt.post(:vote_right, :params => {'auto' => request.session_options[:id], 
				     		              'time_viewed' => time_viewed,
							      'appearance_lookup' => appearance_lookup })
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
	    
	    leveling_message = Visitor.leveling_message(:votes => newprompt['visitor_votes'].to_i,
							:ideas => newprompt['visitor_ideas'].to_i)

            logger.info "newprompt is #{newprompt.inspect}"
            render :json => {:votes => 20, :newleft => truncate((newprompt['left_choice_text']), :length => 137), 
                             :newright => truncate((newprompt['right_choice_text']), :length => 137), 
			     :leveling_message => leveling_message,
			     :prompt_id => newprompt['id'],
			     :appearance_lookup => newprompt['appearance_id']
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
    prompt_id = params[:prompt_id]
    appearance_lookup = params[:appearance_lookup]
    time_viewed = params[:time_viewed]
    reason = params[:cant_decide_reason]

    logger.info "Getting ready to skip out on Prompt #{prompt_id}, Question #{params[:id]}"
    @prompt = Prompt.find(prompt_id, :params => {:question_id => params[:id]})
    #raise Prompt.find(:all).inspect
    respond_to do |format|
        format.xml  {  head :ok }
        format.js  { 
          if p = @prompt.post(:skip, :params => {'auto' => request.session_options[:id],
				                 'time_viewed' => time_viewed, 
					         'appearance_lookup' => appearance_lookup,
					         'skip_reason'=> reason
       						})
            newprompt = Crack::XML.parse(p.body)['prompt']

	    leveling_message = Visitor.leveling_message(:votes => newprompt['visitor_votes'].to_i,
							:ideas => newprompt['visitor_ideas'].to_i)
            render :json => {:votes => 20, 
		             :newleft => truncate((newprompt['left_choice_text']), :length => 137), 
			     :newright => truncate((newprompt['right_choice_text']), :length => 137),
			     :leveling_message => leveling_message,
			     :prompt_id => newprompt['id'],
			     :appearance_lookup => newprompt['appearance_id'],
			     :message => t('vote.cant_decide_message')}.to_json
          else
            render :json => '{"error" : "Skip failed"}'
          end
          }
      end
    end

    def add_idea
      logger.info "Getting ready to add an idea while viewing on Question #{params[:id]}"
      bingo!('submitted_idea')
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
	      
	      leveling_message = Visitor.leveling_message(:votes => newchoice['visitor_votes'].to_i,
							:ideas => newchoice['visitor_ideas'].to_i)
              @question = Question.find(params[:id])
              render :json => {:votes => 20,
                               :choice_status => newchoice['choice_status'], 
			       :leveling_message => leveling_message,
                               :message => "#{t('items.you_just_submitted')}: #{new_idea_data}"}.to_json
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
              verb = @earl.active ? t('items.list.activated') : t('items.list.deactivated')
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
         flash[:registration_error] = t('questions.new.error.registration')
         #redirect_to 'questions/new' and return
         logger.info "Registration failed, here's the flash: #{flash.inspect}"
         render :action => "new" and return
       end
      if @user.save
        logger.info "just saved the user in Questions#create"
        sign_in @user
        just_registered = true
      else
        flash[:notice] = t('questions.new.error.registration')
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
          session[:standard_flash] = "#{t('questions.new.success_flash')}<br /> #{t('questions.new.success_flash2')}: #{@question.fq_earl} #{t('questions.new.success_flash3')}. <br /> #{t('questions.new.success_flash4')}: <a href=\"#{@question.fq_earl}/admin\"> #{t('nav.manage_question')}</a>"
          ::ClearanceMailer.deliver_confirmation(current_user, @question.fq_earl) if just_registered
	  if params[:question]['information'] != ""
		  ::IdeaMailer.deliver_extra_information(current_user, @question, params[:question]['information'])
	  end
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

     
     respond_to do |format|
        if @earl.update_attributes(params[:earl])

	    logger.info("Saving new information on earl")
	    flash[:notice] = 'Question settings saved successfully!'
	    logger.info("Saved new information on earl")
	    format.html {redirect_to "/#{params[:id]}/admin"}
  	    # format.xml  { head :ok }
	else 
            @partial_results_url = "#{@earl.name}/results"
            @choices = Choice.find(:all, :params => {:question_id => @question.id, :include_inactive => true})

	    format.html { render :action => 'admin'}
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

  def about
      render :layout => false
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
