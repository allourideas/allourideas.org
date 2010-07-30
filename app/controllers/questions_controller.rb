class QuestionsController < ApplicationController
  include ActionView::Helpers::TextHelper
  require 'crack'
  require 'geokit'
  before_filter :authenticate, :only => [:admin, :toggle, :toggle_autoactivate, :update, :delete_logo, :export, :add_photos]
  before_filter :admin_only, :only => [:index]
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
    @earl = Earl.find params[:id]

    @question = Question.find(@earl.question_id)
    @question_id = @question.id

    current_page = params[:page] || 1
    current_page = current_page.to_i
    per_page = 50

    logger.info "current page is #{current_page} but params is #{params[:page]}"

    if params[:locale].nil? && @earl.default_lang != I18n.default_locale.to_s
	      I18n.locale = @earl.default_lang
	      redirect_to :action => :results, :controller => :questions, :id => @earl.name and return
    end

    logger.info "@question is #{@question.inspect}."
    @partial_results_url = "#{@earl.name}/results"
    if params[:all]
      choices = Choice.find(:all, :params => {:question_id => @question_id})
    elsif params[:more]
      choices = Choice.find(:all, :params => {:question_id => @question_id,
			                      :limit => per_page, 
					      :offset => (current_page - 1) * per_page})
    else
      choices = Choice.find(:all, :params => {:question_id => @question_id, 
			                      :limit => 10, 
					      :offset => 0})
    end

    if @photocracy
      per_page = 10
      choices = Choice.find(:all,
                            :params => {
                              :question_id => @question_id,
			                        :limit => per_page,
					                    :offset => (current_page - 1) * per_page
					                  })
      @all_choices = Choice.find(:all, :params => {:question_id => @question_id})
    end

    @choices= WillPaginate::Collection.create(current_page, per_page) do |pager|
	       pager.replace(choices)

	       pager.total_entries = @question.choices_count - @question.inactive_choices_count

    end
    
    @available_charts = {}
    @available_charts['votes'] = { :title => t('results.votes_over_time_title')}
    @available_charts['user_submitted_ideas'] = { :title => t('results.user_ideas_over_time_title')}
    @available_charts['user_sessions'] = { :title => t('results.user_sessions_over_time_title')}

    if @photocracy
      @available_charts = [
        {:title => :scatter_ideas_title, :link => 'scatter_plot_user_vs_seed_ideas', :type => 'scatter_ideas', :div_id => 'scatter_ideas-chart-container', :response_type => 'script'},
        {:title => :world_map_title, :link => 'voter_map', :type => 'votes', :response_type => 'html', :div_id => 'voter_map'},
        {:title => :votes_over_time_title, :link => 'timeline_graph', :type => 'votes', :div_id => 'votes-chart-container', :response_type => 'script'},
        {:title => :user_ideas_over_time_title, :link => 'timeline_graph', :type => 'user_submitted_ideas', :div_id => 'user_submitted_ideas-chart-container', :response_type => 'script'},
        {:title => :user_sessions_over_time_title, :link => 'timeline_graph', :type => 'user_sessions', :div_id => 'user_sessions-chart-container', :response_type => 'script'}
      ]
    end

    if @widget == true
      render :layout => false
    end

  end
  
  def admin
    @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
    logger.info "@question = Question.find_by_name(#{params[:id]}) ..."
    @earl = Earl.find params[:id]

    unless ((current_user.owns?(@earl)) || current_user.admin?)
	    logger.info("Current user is: #{current_user.inspect}")
	    flash[:notice] = t('user.not_authorized_error')
	    redirect_to( "/#{params[:id]}") and return
    end

    @question = Question.find(@earl.question_id)
    @partial_results_url = "#{@earl.name}/results"

    @choices = Choice.find(:all, :params => {:question_id => @question.id, :include_inactive => true})
     
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
         @question = Question.new
         @question.id = @earl.question_id
	 votes_by_sids = @question.get(:object_info_by_visitor_id, :object_type => 'uploaded_ideas')
     elsif type == "bounces"
	 @earl = Earl.find params[:id]
         @question = Question.new
         @question.id = @earl.question_id
	 votes_by_sids = @question.get(:object_info_by_visitor_id, :object_type => 'bounces')

     elsif type == "votes"
         @earl = Earl.find params[:id]
         @question = Question.new
         @question.id = @earl.question_id
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
      if @photocracy
        point[:name] = "<img src='#{Photo.find(c.data).image.url(:thumb)}' width='50' height='50' />"
      else
        point[:name] = c.data.strip.gsub("'", "") + "@@@" + c.id.to_s
      end
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
      :chart => { 
        :renderTo => "#{type}-chart-container",
        :margin => [50, 25, 60, 100],
        :borderColor =>  '#919191',
        :borderWidth =>  '1',
        :borderRadius => '0',
        :backgroundColor => '#FFFFFF',
        :height => '500'
      },
      :legend => { :enabled => false },
      :title => { 
        :text => [t('results.scores_of'), t('results.uploaded_ideas'), ('common.and'), t('results.original_ideas')].join(' '), 
        :style => { :color => '#919191' }
      },
      :x_axis => { 
        :min => '0', 
        :max => '100', 
        :endOnTick => true, 
        :showLastLabel => true,
        :type => 'linear', 
        :title => {:enabled => true, :text => t('common.score').titleize}
      },
      :y_axis => { 
        :categories => [t('results.original_ideas'), t('results.uploaded_ideas')], 
        :max => 1, 
        :min => 0
      },
      :plotOptions => {
        :scatter => {:point => {:events => {:click => moreinfoclickfn }}}
      },
      :series => [{
        :name => "#{type.gsub("_", " ").capitalize}",
        :type => 'scatter',
        :color => 'rgba( 49,152,193, .5)',
        :data => chart_data 
      }],

      :tooltip => { :formatter => tooltipformatter }
    })

    render :text => @votes_chart
  end
  
  def scatter_votes_vs_skips
        @earl = Earl.find params[:id]
        @question = Question.new(:id => @earl.question_id)
        votes_by_sids = @question.get(:object_info_by_visitor_id, :object_type => 'votes')

        skips_by_sids = @question.get(:object_info_by_visitor_id, :object_type => 'skips')

        chart_data = []
	max_x = 0
	max_y = 0
        votes_by_sids.sort { |a,b| a[1].to_i <=> b[1].to_i}.each do |sid, votes|
	      point = {}
	      point[:x] = votes
	      max_x = votes.to_i if votes.to_i > max_x
	      if skips = skips_by_sids.delete(sid)
	         point[:y] = skips
	         max_y = skips.to_i if skips.to_i > max_y
	      else
	         point[:y] = 0
	      end
		
	      point[:name] = sid
	      chart_data << point
      end
      # if any sids remain, they have not voted
      skips_by_sids.each do |sid, skips|
	      point = {}
	      point[:x] = 0
	      point[:y] = skips
	      max_y = skips.to_i if skips.to_i > max_y
		
	      point[:name] = sid
	      chart_data << point
      end
      tooltipformatter = "function() { return  this.x + ' Votes '  + this.y + ' Skips '; }"
      @votes_chart = Highchart.scatter({
	    :chart => { :renderTo => "scatter_votes_vs_skips-chart-container",
		    	:margin => [50, 25, 60, 50],
			:borderColor =>  '#919191',
			:borderWidth =>  '1',
			:borderRadius => '0',
			:backgroundColor => '#FFFFFF'
		      },
	    :legend => { :enabled => false },
            :title => { :text => "Number of Votes and Skips by session",
		     	:style => { :color => '#919191' }
		      },
	    :x_axis => { :type => 'linear', :min => 0, :max => max_x,
			 :title => {:enabled => true, :text => "Votes"}},
	    :y_axis => { :min => 0, :max => max_y, :type => 'linear' , :title => {:enabled => true, :title => "Skips"}},
	    :series => [ { :type => 'scatter',
			   :color => 'rgba( 49,152,193, .5)',
	                   :data => chart_data }],
	    :tooltip => { :formatter => tooltipformatter }

      })
      respond_to do |format|
	format.js { render :text => @votes_chart }
     end
  end

  def scatter_votes_by_session
      type = params[:type] 
      @earl = Earl.find params[:id]
      @question = Question.new(:id => @earl.question_id)

      votes_by_sids = @question.get(:object_info_by_visitor_id, :object_type => 'votes')
      bounces_by_sids = @question.get(:object_info_by_visitor_id, :object_type => 'bounces')
      if bounces_by_sids != "\n"
          bounce_hash = {}
          bounces_by_sids.each do |k|
             bounce_hash[k] = 0
          end
          votes_by_sids.merge!(bounce_hash)
      end
     
      case type
      when "votes"
        objects_by_sids = votes_by_sids

      when "skips"
        skips_by_sids = @question.get(:object_info_by_visitor_id, :object_type => 'skips')
        
        skips_by_sids.each do |k,v|
              votes_by_sids.delete(k)
        end
        
	no_skips_size = votes_by_sids.size
        objects_by_sids = skips_by_sids
       end

      chart_data = []
      jitter = Hash.new(0)

      jitter_const = 1
      max = 0
      objects_by_sids.sort { |a,b| a[1].to_i <=> b[1].to_i}.each do |sid, votes|
	      point = {}
	      point[:x] = votes
	      max = votes.to_i if votes.to_i > max
	      point[:y] = jitter[votes] += jitter_const
	      point[:name] = sid
	      chart_data << point
      end
      chart_title = "Number of #{type} by session"
      if no_skips_size
          chart_title += ". Sessions with no skips: #{no_skips_size}"
      end
      
      tooltipformatter = "function() { return '<b>' + this.x + ' #{type.titleize} </b>' ; }"
      @votes_chart = Highchart.scatter({
	    :chart => { :renderTo => "scatter_#{type}_by_session-chart-container",
		    	:margin => [50, 25, 60, 50],
			:borderColor =>  '#919191',
			:borderWidth =>  '1',
			:borderRadius => '0',
			:backgroundColor => '#FFFFFF'
		      },
	    :legend => { :enabled => false },
            :title => { :text => chart_title,
		     	:style => { :color => '#919191' }
		      },
	    :x_axis => { :type => 'linear', :min => 0, :max => max,
			 :title => {:enabled => true, :text => type.titleize}},
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
        @question = Question.new(:id => @earl.question_id)
      end
      
      case type
      when 'votes'
	 if totals == "true"
             votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'votes')
	 else
             votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'votes')
	 end
         chart_title = t('results.number_of') +  t('common.votes') + t('results.per_day')
         y_axis_title = t('results.number_of') + t('common.votes')
      when 'skips'
	 if totals == "true"
             votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'skips')
	 else
             votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'skips')
	 end
         chart_title = t('results.number_of') +  t('common.skips') + t('results.per_day')
         y_axis_title = t('results.number_of') + t('common.skips')
      when 'user_sessions'
	 if totals == "true"
             votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'user_sessions')
	 else
             votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'user_sessions')
	 end
         chart_title = t('results.number_of') +  t('common.user_sessions') + t('results.per_day')
         y_axis_title = t('results.number_of') + t('common.user_sessions')
      when 'user_submitted_ideas'
	 if totals == "true"
             votes_count_hash = Question.get(:all_object_info_totals_by_date, :object_type => 'user_submitted_ideas')
	 else
             votes_count_hash = @question.get(:object_info_totals_by_date, :object_type => 'user_submitted_ideas')
	 end
         chart_title = t('results.number_of') +  t('common.ideas').titleize + t('results.per_day')
         y_axis_title = t('results.number_of') + t('common.ideas')
       when 'unique_users'
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
     @question = Question.new(:id => @earl.question_id)

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

    def add_idea
      bingo!('submitted_idea')
      new_idea_data = params[:new_idea]
      
      if @photocracy
        new_idea_data = Photo.create(:image => params[:new_idea]).id
      end

      choice_params = {:visitor_identifier => request.session_options[:id], 
	      	       :data => new_idea_data, 
		       :question_id => params[:id]}

      choice_params.merge!(:local_identifier => current_user.id) if signed_in?


        if @choice = Choice.create(choice_params)
          @question = Question.find(params[:id], :params => {
                                      :with_visitor_stats => true,
                                      :visitor_identifier => request.session_options[:id]
                                    })

          leveling_message = Visitor.leveling_message(:votes => @question.attributes['visitor_votes'].to_i,
                                                      :ideas => @question.attributes['visitor_ideas'].to_i)

          @earl = Earl.find_by_question_id(@question.id)
          if @choice.active?
            IdeaMailer.send_later :deliver_notification_for_active, @earl, @question.name, new_idea_data, @choice.id, @photocracy
          else
            IdeaMailer.send_later :deliver_notification, @earl, @question.name, new_idea_data, @choice.id, @photocracy
          end

          if @photocracy
            render :text => 'success', :content_type => 'text/html'
          else
            render :json => {
                     :choice_status => @choice.active? ? 'active' : 'inactive',
                     :leveling_message => leveling_message,
                     :message => "#{t('items.you_just_submitted')}: #{new_idea_data}"
                   }.to_json
          end
        else
          render :json => '{"error" : "Addition of new idea failed"}'
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
    @question = Question.find(@earl.question_id)
    unless current_user.owns? @earl
      render(:json => {:message => "Succesfully changed settings, #{params[:id]}"}.to_json) and return
    end
    logger.info "Getting ready to change idea autoactivate status of Question #{params[:id]} to #{!@question.it_should_autoactivate_ideas?}"

    @question.it_should_autoactivate_ideas = !@question.it_should_autoactivate_ideas
    verb = @question.it_should_autoactivate_ideas ? 'Enabled' : 'Disabled'

    respond_to do |format|
      logger.info("Question is: #{@question.inspect}")
      format.xml  {  head :ok }
      format.js  {
        if @question.save
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
    @question = Question.new(params[:question])
    @user = User.new(:email => params[:question]['email'],
                     :password => params[:question]['password'],
                     :password_confirmation => params[:question]['password']) unless signed_in?

    if question_params_valid
      earl_options = {:question_id => @question.id, :name => params[:question]['url'].strip}
      earl_options.merge!(:flag_enabled => true) if @photocracy # flag is enabled by default for photocracy
      earl = current_user.earls.create(earl_options)
      ClearanceMailer.send_later(:deliver_confirmation, current_user, earl.name, @photocracy)
      IdeaMailer.send_later(:deliver_extra_information, current_user, @question.name, params[:question]['information'], @photocracy) unless params[:question]["information"].blank?
      session[:standard_flash] = "#{t('questions.new.success_flash')}<br /> #{t('questions.new.success_flash2')}: #{@question.fq_earl} #{t('questions.new.success_flash3')}. <br /> #{t('questions.new.success_flash4')}: <a href=\"#{@question.fq_earl}/admin\"> #{t('nav.manage_question')}</a>"      

      if @photocracy
        redirect_to add_photos_url(earl.name)
      else
        redirect_to(:action => 'show', :id => earl.name, :just_created => true, :controller => 'earls')
      end
    else
      render(:action => "new")
    end
  end

  def question_params_valid
    if @question.valid?(@photocracy) && (signed_in? || (@user.valid? && @user.save && sign_in(@user)))
      @question.attributes.merge!({'local_identifier' => current_user.id,
  	    			                     'visitor_identifier' => request.session_options[:id]})
      return true if @question.save
    else
      return false
    end
  end

  # # PUT /questions/1
  # # PUT /questions/1.xml
  def update
     @meta = '<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">'
     @earl = Earl.find params[:id]
     @question = Question.find(@earl.question_id)
     
     unless ( (current_user.owns? @earl) || current_user.admin?)
	    flash[:notice] = "You are not authorized to view that page"
	    redirect_to( {:action => :show, :controller => :earls},  :id=> params[:id]) and return
     end

     
     respond_to do |format|
        if @earl.update_attributes(params[:earl])

	    logger.info("Saving new information on earl")
	    flash[:notice] = 'Question settings saved successfully!'
	    logger.info("Saved new information on earl")
	    format.html {redirect_to(:action => 'admin', :id => @earl.name)}
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
	    logger.info("Current user is: #{current_user.inspect}")
	    flash[:notice] = "You are not authorized to view that page"
	    redirect_to( "/#{params[:id]}") and return
    end
     @question = Question.find(@earl.question_id)
     
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
       response = "You are not authorized to export data from this idea marketplace, please contact us at info@allouridea.org if you think this is a mistake"
       render :text => response and return
    end

    #creates delayed job that: sends request to pairwise, waits for response from pairwise, 
    #  does some work to add ip address and click information to csv file, store in public/
    #  create delayed job to delete file in 3 days, sends email to user with link
   
    if params[:type].nil?
	    render :text => "An error has occured! Please try again later." and return
    else
      @earl.send_later :export_and_notify, :type => params[:type], :email => current_user.email, :photocracy => @photocracy
    end
      
    
    
    response = "You have requested a data export of all #{params[:type]}. Our servers are hard at work compiling the necessary data right now. You should receive an email at #{current_user.email} with a link to your data export when the file is ready. Please be patient, this process can take up to an hour, depending on how much information is requested and how busy our servers are." 

    render :text => response
    #send_data(csv_data,
    #    :type => 'text/csv; charset=iso-8859-1; header=present',
    #    :disposition => "attachment; filename=#{outfile}")

  end

  def about
      render :layout => false
  end

  def add_photos
    @earl = Earl.find_by_name!(params[:id])
    @question = Question.find(@earl.question_id)
  end
  
  # necessary because the flash isn't sending AUTH_TOKEN correctly for some reason
  protect_from_forgery :except => [:upload_photos]
  def upload_photos
    @earl = Earl.find_by_name!(params[:id])

    new_idea_data = Photo.create(:image => params[:Filedata]).id
    choice_params = {
      :visitor_identifier => params[:session_identifier],
      :data => new_idea_data,
	    :question_id => @earl.question_id,
	    :active => true
	  }

	  if Choice.create(choice_params)
	    render :text => 'yeah!'
    else
      render :text => 'Choice creation failed', :status => 500
    end
  end

  def visitor_voting_history
    @votes = Session.new(:id => request.session_options[:id]).get(:votes)

    if @photocracy
      @votes['votes'].each do |vote|
        vote[:left_choice_thumb]  = Photo.find(vote['left_choice_data']).image.url(:thumb)
        vote[:right_choice_thumb] = Photo.find(vote['right_choice_data']).image.url(:thumb)
      end
    end
    render :json => @votes.to_json
  end
end
