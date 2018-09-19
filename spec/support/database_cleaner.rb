RSpec.configure do |config|
  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)
  end

  # FIXME: dynamic strategy based on example type
  #        test db hangs with this :-(
  config.around(:each) do |example|
    # Faker::Hipster.unique.clear
    # rubocop:disable Lint/UselessAssignment
    strategy = :transaction
    metadata = example.metadata
    if metadata[:truncate_db] ||
        metadata[:js] ||
        metadata[:poltergeist] ||
        metadata[:type] == :feature

      strategy = :deletion
    end
    # rubocop:enable Lint/UselessAssignment

    DatabaseCleaner.strategy = :deletion # strategy

    DatabaseCleaner.cleaning do
      ActionMailer::Base.deliveries.clear
      example.run
    end
  end
end
