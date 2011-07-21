namespace :database do

  desc "Convert instances of the tracking parameter to info"
  task :tracking_to_info => :environment do
    Click.find_each( :conditions => ["url LIKE ? OR referrer LIKE ?", '%tracking=%', '%tracking=%']) do |click|
      click.url = click.url.gsub(/([?&])tracking=/, '\1info=')
      click.referrer = click.referrer.gsub(/([?&])tracking=/, '\1info=')
      click.save
    end
  end

  desc "Get breakdown of usage by language"
  task :stats_by_language => :environment do
    questions = Question.find(:all)
    questions_by_id = {}
    questions.each do |question|
      questions_by_id[question.id] = question
    end

    languages = Earl.find(:all, :select => "DISTINCT(default_lang)")
    puts ["language", "num_marketplaces", "num_uploaded_ideas", "num_ideas", "num_votes"].join(", ")
    languages.each do |language|
      earls = Earl.find(:all, :select => :question_id, :conditions => {
        :default_lang => language.default_lang,
        :question_id => questions_by_id.keys
      })
      
      num_marketplaces = num_uploaded_ideas = num_votes = num_ideas = 0
      earls.each do |earl|
        question = questions_by_id[earl.question_id]
        if question
          num_marketplaces += 1
          num_votes += question.votes_count
          num_ideas += question.choices_count
          begin
            question.get(:object_info_totals_by_date, :object_type => 'user_submitted_ideas').each do |k, v|
              num_uploaded_ideas += v
            end
          rescue
          end
        end
      end
      puts [language.default_lang, num_marketplaces, num_uploaded_ideas ,num_ideas ,num_votes].join(", ")
    end
  end
end
