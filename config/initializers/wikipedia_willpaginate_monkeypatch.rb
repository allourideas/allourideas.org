require 'will_paginate/view_helpers/link_renderer'

class BootstrapPagination < WillPaginate::ViewHelpers::LinkRenderer

  def initialize
    @gap_marker = '<li class="disabled gap"><a href="javascript://">&hellip;</a></li>'
  end

  def page_link_or_span(page, span_class, text = nil)
    text ||= page.to_s
    if span_class.include?('prev_page')
      classname = 'prev' 
    elsif span_class.include?('next_page')
      classname = 'next'
    else
      classname = ''
    end
    classname += ' active' if page == current_page
    span_class = span_class.gsub('disabled','') if page
    if page && page != current_page
      @template.content_tag :li, @template.link_to(text, url_for(page)), :class => [classname, span_class].join(' ')
    else
      @template.content_tag :li, @template.link_to(text, url_for(page)), :class => [classname, span_class].join(' ')
    end
  end

end
