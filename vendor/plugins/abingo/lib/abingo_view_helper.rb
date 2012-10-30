#Gives you easy syntax to use ABingo in your views.

module AbingoViewHelper

  def ab_test(test_name, alternatives = nil, options = {}, &block)

    if (Abingo.options[:enable_specification] && !params[test_name].nil?)
      choice = params[test_name]
    elsif (Abingo.options[:enable_override_in_session] && !session[test_name].nil?)
      choice = session[test_name]
    elsif (alternatives.nil?)
      choice = Abingo.flip(test_name)
    else
      choice = Abingo.test(test_name, alternatives, options)
    end

    if block
      content_tag = capture(choice, &block)
      unless Rails::VERSION::MAJOR >= 3
        block_called_from_erb?(block) ? concat(content_tag) : content_tag
      else
        content_tag
      end
    else
      choice
    end
  end

  def bingo!(test_name, options = {})
    Abingo.bingo!(test_name, options)
  end

  #This causes an AJAX post against the URL.  That URL should call Abingo.human!
  #This guarantees that anyone calling Abingo.human! is capable of at least minimal Javascript execution, and thus is (probably) not a robot.
  def include_humanizing_javascript(url = "/abingo_mark_human", style = :prototype)
    script = nil
    if (style == :prototype)
      script = "var a=Math.floor(Math.random()*11); var b=Math.floor(Math.random()*11);var x=new Ajax.Request('#{url}', {parameters:{a: a, b: b, c: a+b}})"
    elsif (style == :jquery)
      script = "var a=Math.floor(Math.random()*11); var b=Math.floor(Math.random()*11);var x=jQuery.post('#{url}', {a: a, b: b, c: a+b})"
    end
    script.nil? ? "" : %Q|<script type="text/javascript">#{script}</script>|
  end
  
end