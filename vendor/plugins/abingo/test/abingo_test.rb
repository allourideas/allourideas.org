require 'test_helper'

class AbingoTest < ActiveSupport::TestCase

  #Wipes cache, D/B prior to doing a test run.
  Abingo.cache.clear
  Abingo::Experiment.delete_all
  Abingo::Alternative.delete_all

  test "identity automatically assigned" do
    assert Abingo.identity != nil
  end

  test "alternative parsing" do
    array = %w{a b c}
    assert_equal array, Abingo.parse_alternatives(array)
    assert_equal 65, Abingo.parse_alternatives(65).size
    assert_equal 4, Abingo.parse_alternatives(2..5).size
    assert !(Abingo.parse_alternatives(2..5).include? 1)
  end

  test "experiment creation" do
    assert_equal 0, Abingo::Experiment.count
    assert_equal 0, Abingo::Alternative.count
    alternatives = %w{A B}
    alternative_selected = Abingo.test("unit_test_sample_A", alternatives)
    assert_equal 1, Abingo::Experiment.count
    assert_equal 2, Abingo::Alternative.count
    assert alternatives.include?(alternative_selected)
  end

  test "exists works right" do
    Abingo.test("exist works right", %w{does does_not})
    assert Abingo::Experiment.exists?("exist works right")
  end

  test "alternatives picked consistently" do
    alternative_picked = Abingo.test("consistency_test", 1..100)
    100.times do
      assert_equal alternative_picked, Abingo.test("consistency_test", 1..100)
    end
  end

  test "participation works" do
    new_tests = %w{participationA participationB participationC}
    new_tests.map do |test_name|
      Abingo.test(test_name, 1..5)
    end

    participating_tests = Abingo.cache.read("Abingo::participating_tests::#{Abingo.identity}") || []

    new_tests.map do |test_name|
      assert participating_tests.include? test_name
    end
  end

  test "participants counted" do
    test_name = "participants_counted_test"
    alternative = Abingo.test(test_name, %w{a b c})

    ex = Abingo::Experiment.find_by_test_name(test_name)
    lookup = Abingo::Alternative.calculate_lookup(test_name, alternative)
    chosen_alt = Abingo::Alternative.find_by_lookup(lookup)
    assert_equal 1, ex.participants
    assert_equal 1, chosen_alt.participants
  end

  test "conversion tracking by test name" do
    test_name = "conversion_test_by_name"
    alternative = Abingo.test(test_name, %w{a b c})
    Abingo.bingo!(test_name)
    ex = Abingo::Experiment.find_by_test_name(test_name)
    lookup = Abingo::Alternative.calculate_lookup(test_name, alternative)
    chosen_alt = Abingo::Alternative.find_by_lookup(lookup)
    assert_equal 1, ex.conversions
    assert_equal 1, chosen_alt.conversions
    Abingo.bingo!(test_name)

    #Should still only have one because this conversion should not be double counted.
    #We haven't specified that in the test options.
    assert_equal 1, Abingo::Experiment.find_by_test_name(test_name).conversions
  end

  test "conversion tracking by conversion name" do
    conversion_name = "purchase"
    tests = %w{conversionTrackingByConversionNameA conversionTrackingByConversionNameB conversionTrackingByConversionNameC}
    tests.map do |test_name|
      Abingo.test(test_name, %w{A B}, :conversion => conversion_name)
    end

    Abingo.bingo!(conversion_name)
    tests.map do |test_name|
      assert_equal 1, Abingo::Experiment.find_by_test_name(test_name).conversions
    end
  end

  test "short circuiting works" do
    conversion_name = "purchase"
    test_name = "short circuit test"
    alt_picked = Abingo.test(test_name, %w{A B}, :conversion => conversion_name)
    ex = Abingo::Experiment.find_by_test_name(test_name)
    alt_not_picked = (%w{A B} - [alt_picked]).first

    ex.end_experiment!(alt_not_picked, conversion_name)

    ex.reload
    assert_equal "Finished", ex.status
    
    Abingo.bingo!(test_name)  #Should not be counted, test is over.
    assert_equal 0, ex.conversions

    old_identity = Abingo.identity
    Abingo.identity = "shortCircuitTestNewIdentity"
    Abingo.test(test_name, %w{A B}, :conversion => conversion_name)
    Abingo.identity = old_identity
    ex.reload
    assert_equal 1, ex.participants  #Original identity counted, new identity not counted b/c test stopped
  end

  test "proper experiment creation in high concurrency" do
    conversion_name = "purchase"
    test_name = "high_concurrency_test"
    alternatives = %w{foo bar}

    threads = []
    5.times do
      threads << Thread.new do
        Abingo.test(test_name, alternatives, conversion_name)
        1
      end
    end
    sleep(10)
    assert_equal 1, Abingo::Experiment.count_by_sql(["select count(id) from experiments where test_name = ?", test_name])
  end

  test "non-humans are ignored for participation and conversions if not explicitly counted" do
    Abingo.options[:count_humans_only] = true
    Abingo.options[:expires_in] = 1.hour
    Abingo.options[:expires_in_for_bots] = 3.seconds
    first_identity = Abingo.identity = "unsure_if_human#{Time.now.to_i}"
    test_name = "are_you_a_human"
    Abingo.test(test_name, %w{does_not matter})

    assert_false Abingo.is_human?, "Identity not marked as human yet."

    ex = Abingo::Experiment.find_by_test_name(test_name)
    Abingo.bingo!(test_name)
    assert_equal 0, ex.participants, "Not human yet, so should have no participants."
    assert_equal 0, ex.conversions, "Not human yet, so should have no conversions."

    Abingo.human!
    
    #Setting up second participant who doesn't convert.
    Abingo.identity = "unsure_if_human_2_#{Time.now.to_i}"
    Abingo.test(test_name, %w{does_not matter})
    Abingo.human!

    ex = Abingo::Experiment.find_by_test_name(test_name)
    assert_equal 2, ex.participants, "Now that we're human, our participation should matter."
    assert_equal 1, ex.conversions, "Now that we're human, our conversions should matter, but only one of us converted."
  end

  test "Participating tests for a given identity" do
    Abingo.identity = "test_participant"
    test_names = (1..3).map {|t| "participating_test_test_name #{t}"}
    test_alternatives = %w{yes no}
    test_names.each {|test_name| Abingo.test(test_name, test_alternatives)}
    ex = Abingo::Experiment.last
    ex.end_experiment!("no")  #End final of 3 tests, leaving 2 presently running

    assert_equal 2, Abingo.participating_tests.size  #Pairs for two tests
    Abingo.participating_tests.each do |key, value|
      assert test_names.include? key
      assert test_alternatives.include? value
    end
    
    assert_equal 3, Abingo.participating_tests(false).size #pairs for three tests
    Abingo.participating_tests(false).each do |key, value|
      assert test_names.include? key
      assert test_alternatives.include? value
    end

    Abingo.identity = "test_nonparticipant"
    assert_equal({}, Abingo.participating_tests)
  end

end
