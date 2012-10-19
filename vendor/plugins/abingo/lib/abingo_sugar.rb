#This module exists entirely to save finger strain for programmers.
#It is designed to be included in your ApplicationController.
#
#See abingo.rb for descriptions of what these do.

module AbingoSugar

  def ab_test(test_name, alternatives = nil, options = {})
    if (Abingo.options[:enable_specification] && !params[test_name].nil?)
      choice = params[test_name]
    elsif (Abingo.options[:enable_override_in_session] && !session[test_name].nil?)
      choice = session[test_name]
    elsif (alternatives.nil?)
      choice = Abingo.flip(test_name)
    else
      choice = Abingo.test(test_name, alternatives, options)
    end

    if block_given?
      yield(choice)
    else
      choice
    end
  end

  def bingo!(test_name, options = {})
    Abingo.bingo!(test_name, options)
  end

  #Mark the user as a human.
  def abingo_mark_human
    textual_result = "1"
    begin
      a = params[:a].to_i
      b = params[:b].to_i
      c = params[:c].to_i
      if (request.method == :post && (a + b == c))
        Abingo.human!
      else
        textual_result = "0"
      end
    rescue #If a bot doesn't pass a, b, or c, to_i will fail.  This scarfs up the exception, to save it from polluting our logs.
      textual_result = "0"
    end
    render :text => textual_result, :layout => false #Not actually used by browser

  end

end