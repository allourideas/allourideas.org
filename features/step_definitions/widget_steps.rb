When /^I click the WIDGET (.*) tab$/ do |tab_name|
    case tab_name
    when "About"
      find(".about_tab").click
    when "View Results"
      find(".results_tab").click
    end
end

# Note: I believe this statement goes unused.
When /^I click on (.*) in the footer$/ do |link_name|
      case link_name
      when "Return to Voting"
        find(".return_voting").click
      when "View More Results"
      	find("#view_more_results").click
      end
end

Then /^I should remain on the WIDGET View Results tab$/ do
  page.should have_content("View More Results")
end

Then /^I should have switched to and be on the WIDGET Cast Votes tab$/ do
  page.should have_content("left_choice_cell")
end 

And /^I wait (.*) seconds$/ do |wait_time|
  sleep wait_time.to_i
end
