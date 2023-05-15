namespace :plausible do
  desc "Add all plausible goals"
  task add_all_goals: :environment do
    helper = Object.new.extend(PlausibleHelper) # replace MyHelper with the module name where the helper is defined
    helper.add_all_plausible_goals
  end
end
