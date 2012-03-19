namespace :timezone do

  # There is a very similar task in the pairwise code base as well.
  # Any core changes to this task should probably be reflected there.
  desc "Converts all dates from PT to UTC"
  task :convert_dates_to_utc, [:workerid,:workers] => [:environment] do |t,args|
    args.with_defaults(:workerid => "0", :workers => "1")
    raise "workerid can not be greater than workers" if args[:workerid] > args[:workers]
    time_spans = [
      { :gt => "2009-11-01 01:59:59", :lt => "2010-03-14 02:00:00", :h => 8},
      { :gt => "2010-03-14 01:59:59", :lt => "2010-11-07 01:00:00", :h => 7},
      { :gt => "2010-11-07 00:59:59", :lt => "2010-11-07 02:00:00", :h => nil},
      { :gt => "2010-11-07 01:59:59", :lt => "2011-03-13 02:00:00", :h => 8},
      { :gt => "2011-03-13 01:59:59", :lt => "2011-11-06 01:00:00", :h => 7},
      { :gt => "2011-11-06 00:59:59", :lt => "2011-11-06 02:00:00", :h => nil},
      { :gt => "2011-11-06 01:59:59", :lt => "2012-03-11 02:00:00", :h => 8},
      { :gt => "2012-03-11 01:59:59", :lt => "2012-11-04 01:00:00", :h => 7}
    ]
    unambiguator = {
      :clicks => [
        { :range => 5780692..5780964, :h => 7},
        { :range => 5780965..5781065, :h => 8},
        { :range => 877752..877834, :h => 7},
        { :range => 877835..878115, :h => 8},
      ],
      :earls => [
        { :range => 1787..1787, :h => 7} # based on click id 5780744
      ],
      :experiments => [
        { :range => 4394..4394, :h => 7} # based on click id 5780748
      ],
      :session_infos => [
        { :range => 1531703..1531750, :h => 7},
        { :range => 1531751..1531831, :h => 8},
        { :range => 309923..309939, :h => 7},
        { :range => 309940..309982, :h => 8},
      ],
      :trials => [
        { :range => 142807..142815, :h => 7},
        { :range => 142816..142826, :h => 8},
        { :range => 791697..791741, :h => 7},
        { :range => 791742..791769, :h => 8},
      ],
      :users => [
        { :range => 1127..1127, :h => 7} # based on click id 5780742
      ],
      :visitors => [
        { :range => 1375991..1376030, :h => 7},
        { :range => 1376031..1376104, :h => 8},
        { :range => 281684..281698, :h => 7},
        { :range => 281699..281737, :h => 8},
      ],
    }
    # UTC because Rails will be thinking DB is in UTC when we run this
    #time_spans.map! do |t|
    #  { :gt => Time.parse("#{t[:gt]} UTC"),
    #    :lt => Time.parse("#{t[:lt]} UTC"),
    #    :h  => t[:h] }
    #end
    datetime_fields = {
      :clicks         => ['created_at', 'updated_at'],
      :earls          => ['created_at', 'updated_at', 'logo_updated_at'],
      :experiments    => ['created_at', 'updated_at'],
      :exports        => ['created_at', 'updated_at'],
      :photos         => ['created_at', 'updated_at', 'image_updated_at'],
      :session_infos  => ['created_at', 'updated_at'],
      :slugs          => ['created_at'],
      :trials         => ['created_at', 'updated_at'],
      :visitors       => ['created_at', 'updated_at'],
      :users          => ['created_at', 'updated_at'],
      :delayed_jobs   => ['created_at', 'updated_at', 'run_at', 'locked_at', 'failed_at'],
    }

    STDOUT.sync = true
    logger = Rails.logger
    datetime_fields.each do |table, columns|
      print "#{table}"
      batch_size = 10000
      i = 0
      where = ''
      # This is how we split the rows of a table between the various workers
      # so that they don't attempt to work on the same row as another worker.
      # The workerid is any number 0 through workers - 1.
      if args[:workers] > "1"
        where = "WHERE MOD(id, #{args[:workers]}) = #{args[:workerid]}"
      end
      while true do
        rows = ActiveRecord::Base.connection.select_all(
          "SELECT id, #{columns.join(", ")} FROM #{table} #{where} ORDER BY id LIMIT #{i*batch_size}, #{batch_size}"
        )
        print "."

        rows.each do |row|
          updated_values = {}
          # delete any value where the value is blank (just for delayed_jobs)
          row.delete_if {|key, value| value.blank? }
          row.each do |column, value|
            next if column == "id"
            time_spans.each do |span|
              if value < span[:lt] && value > span[:gt]
                # if blank then ambiguous and we don't know how to translate
                if span[:h].blank?
                  updated_values[column] = nil
                  if unambiguator[table] && unambiguator[table].length > 0
                    unambiguator[table].each do |ids|
                      updated_values[column] = ids[:h] if ids[:range].include? row["id"].to_i
                    end
                  end

                  logger.info "AMBIGUOUS: #{table} #{row["id"]} #{column}: #{value}" if updated_values[column].blank?
                else
                  updated_values[column] = span[:h]
                end
                break
              end
            end
          end
          # Check if some columns did not match any spans
          key_diff = row.keys - updated_values.keys - ["id"]
          if key_diff.length > 0
            logger.info "MISSING SPAN: #{table} #{row["id"]} #{key_diff.inspect} #{row.inspect}"
          end
          # remove ambiguous columns (we set them to nil above)
          updated_values.delete_if {|key, value| value.blank? }
          if updated_values.length > 0
            update = "UPDATE #{table} SET #{updated_values.map{|k,v| "#{k} = DATE_ADD(#{k}, INTERVAL #{v} HOUR)"}.join(", ")} WHERE id = #{row["id"]}"
            num = ActiveRecord::Base.connection.update_sql(update)
            if num == 1
              logger.info "UPDATE: #{table} #{row.inspect} #{updated_values.inspect}"
            else
              logger.info "UPDATE FAILED: #{table} #{row.inspect} #{updated_values.inspect} #{num.inspect}"
            end
          end
        end

        i+= 1
        break if rows.length < batch_size
      end
      print "\n"
    end
  end

  desc "Finds ambiguous times due to daylight savings time"
  task :find_ambiguous_times => :environment do
    datetime_fields = {
      :clicks         => ['created_at', 'updated_at'],
      :earls          => ['created_at', 'updated_at', 'logo_updated_at'],
      :experiments    => ['created_at', 'updated_at'],
      :exports        => ['created_at', 'updated_at'],
      :photos         => ['created_at', 'updated_at', 'image_updated_at'],
      :session_infos  => ['created_at', 'updated_at'],
      :slugs          => ['created_at'],
      :trials         => ['created_at', 'updated_at'],
      :visitors       => ['created_at', 'updated_at'],
      :users          => ['created_at', 'updated_at'],
      :delayed_jobs   => ['created_at', 'updated_at', 'run_at', 'locked_at', 'failed_at'],
    }
    datetime_fields.each do |table, columns|
      where = columns.map{|c| "((#{c} > '2010-11-07 00:59:59' AND #{c} < '2010-11-07 02:00:00') OR (#{c} > '2011-11-06 00:59:59' AND #{c} < '2011-11-06 02:00:00'))"}.join(" OR ")
      rows = ActiveRecord::Base.connection.select_all(
        "SELECT id, #{columns.join(", ")} FROM #{table} WHERE #{where}"
      )
      puts rows.inspect if rows.length > 0
    end
  end

end
