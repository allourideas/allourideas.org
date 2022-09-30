module NavigationHelpers
  def path_to(page_name)
    path = case page_name

    when /the homepage/i
      root_path
    when /the sign up page/i
      new_user_path
    when /the sign in page/i
      new_session_path
    when /the password reset request page/i
      new_password_path

    when /the question show page/i
      question_path
    when /the question create page/i
      new_question_path
    when /the questions index page/i
      questions_path

    when /the Cast Votes page for '([^'].*)'/i
	"/"+ $1
    when /the Crossfade Cast Votes page for '([^'].*)'/i
	"/"+ $1 + "?crossfade=true"
    when /the Just Created Cast Votes page for '([^'].*)'/i
	"/"+ $1 + "?just_created=true"
    when /the View Results page for '([^'].*)'/i
	"/"+ $1 + "/results"
    when /the Admin page for '([^'].*)'/i
	"/"+ $1 + "/admin"
    when /the Owner Add Photos page for '([^'].*)'/i
	"/"+ $1 + "/addphotos"
    when /the Control Panel All page/i
	 admin_path + "?all=true"
    when /the Control Panel page/i
	 admin_path
    when /the WIDGET Cast Votes page for '([^'].*)'/i
	"/"+ $1 + '?widget&width=450&height=410'
    when /the multiple widgets embedded page/
      "/tests/multiple-widgets-test.html"
    when /the multiple same widgets embedded page/
      "/tests/multiple-same-widgets-test.html"

    when /the Deactivate page for the saved (.*) choice/
	 @earl = Earl.find_by(question_id: @question_id)
	 choice = ($1 == "left") ? @left_choice : @right_choice
	 deactivate_question_choice_path(:question_id => @earl, :id => choice.id)

    when /the Activate page for the saved (.*) choice/
	 @earl = Earl.find_by(question_id: @question_id)
	 choice = ($1 == "left") ? @left_choice : @right_choice
	 activate_question_choice_path(:question_id => @earl, :id => choice.id)


    when /the Idea Detail page for the saved left choice(.*)?/i
	 @earl = Earl.find_by(question_id: @question_id)
	 url_opts = {:question_id => @earl, :id => @left_choice.id}
	 if($1 =~ /with login reminder/i)
		 url_opts.merge!(:login_reminder => true)
	 end
	 question_choice_path(url_opts)
    when /the Idea Detail page for the saved right choice/i
	 @earl = Earl.find_by(question_id: @question_id)
	 question_choice_path(:question_id => @earl, :id => @right_choice.id)
    # Add more page name => path mappings here

    else
      raise "Can't find mapping from \"#{page_name}\" to a path."
    end
    if @photocracy_mode
	path += (path.include?("?")) ? "&" : "?"
        path += "photocracy_mode=true"
    end
    path
  end
end

World(NavigationHelpers)
