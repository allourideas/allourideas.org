module NavigationHelpers
  def path_to(page_name)
    case page_name

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
    when /the Just Created Cast Votes page for '([^'].*)'/i
	"/"+ $1 + "?just_created=true"
    when /the View Results page for '([^'].*)'/i
	"/"+ $1 + "/results"
    when /the Admin page for '([^'].*)'/i
	"/"+ $1 + "/admin"
    
    when /the Idea Detail page for the saved left choice/i
	 @earl = Earl.find_by_question_id(@question_id)
	 question_choice_path(:question_id => @earl, :id => @left_choice.id)
    when /the Idea Detail page for the saved right choice/i
	 @earl = Earl.find_by_question_id(@question_id)
	 question_choice_path(:question_id => @earl, :id => @right_choice.id)
    # Add more page name => path mappings here

    else
      raise "Can't find mapping from \"#{page_name}\" to a path."
    end
  end
end

World(NavigationHelpers)
