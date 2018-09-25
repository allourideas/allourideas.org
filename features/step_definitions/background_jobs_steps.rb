When(/^I wait for background jobs to complete$/) do
  _success, failure = Delayed::Worker.new(
             quiet: true # you might want to change this to false for debugging
           ).work_off

  if failure > 0
    raise "Delayed job failed"
  end
end
