require 'http'
require 'json'

module PlausibleHelper
  # Add other helper methods here
  ALL_GOALS = [
    ""
  ]

  def plausible_stats_proxy_helper(plausible_url, props)
    return nil unless ENV['PLAUSIBLE_BASE_URL'] && ENV['PLAUSIBLE_API_KEY']

    first_part_of_url, query_string = plausible_url.split('?')
    search_params = Rack::Utils.parse_nested_query(query_string)

    filters_content = nil
    base_url = ENV['PLAUSIBLE_BASE_URL'].gsub('/api/v1/', '')

    if plausible_url.include?('timeseries') || plausible_url.include?('aggregate')
      custom_property_name = props.keys.first
      custom_property_value = props.values.first
      filters_content = search_params['filters']
      filters_content = "#{filters_content};event:props:#{custom_property_name}==#{custom_property_value}"
      search_params['filters'] = filters_content
      search_params.delete('with_imported')
      period = search_params['period']

      if period == 'all'
        search_params.delete('date')
        search_params['period'] = 'custom'
        stats_begin_time = DateTime.parse(search_params['statsBegin'])
        plausible_begin_time = DateTime.parse('2022-08-13')
        begin_time = stats_begin_time < plausible_begin_time ? plausible_begin_time : stats_begin_time
        date_now = DateTime.now.strftime('%Y-%m-%d')
        search_params['date'] = "#{begin_time.strftime('%Y-%m-%d')},#{date_now}"
      end

      search_params.delete('statsBegin')
      base_url = "https://#{base_url.split('@')[1]}"
    else
      filters_content = JSON.parse(search_params['filters'])
      filters_content = filters_content.deep_merge(props)
      search_params['filters'] = filters_content.to_json
    end

    uri = URI.parse(ENV['PLAUSIBLE_EVENT_BASE_URL'])

    username = uri.user
    password = uri.password

    auth = Base64.strict_encode64("#{username}:#{password}")

    new_url = "#{first_part_of_url}?#{search_params.to_query}"
    options = {
      headers: {
        'Authorization' => "Basic #{auth}",
        'User-Agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.3',
        'referrer' => '',
        'Authorization' => "Bearer #{ENV['PLAUSIBLE_API_KEY']}",
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
      }
    }

    response = HTTP.headers(options[:headers]).get(base_url + new_url)

    if response.status.success?
      response.body.to_s
    else
      Rails.logger.error("Error in plausibleStatsProxy: #{response.inspect}")
      Rails.logger.error("Error in plausibleStatsProxy: #{response.status.code}")
      raise "Error in plausibleStatsProxy: #{response.status.code}"
    end
  end

  def get_plausible_stats(stats_params)
    if ENV['PLAUSIBLE_BASE_URL'] && ENV['PLAUSIBLE_API_KEY']
      begin
        response = Http.headers(
          'Authorization' => "Bearer #{ENV['PLAUSIBLE_API_KEY']}",
          'X-Forwarded-For' => '127.0.0.1',
          'Content-Type' => 'application/json'
        ).get("#{ENV['PLAUSIBLE_BASE_URL']}stats/#{stats_params}")

        if response.status == 200
          return JSON.parse(response.body.to_s)
        else
          Rails.logger.error("Error in get_plausible_stats: #{response.status}")
          return nil
        end
      rescue => error
        Rails.logger.error("Error in get_plausible_stats: #{error}")
        return nil
      end
    else
      Rails.logger.warn("No plausible base url or api key")
      return nil
    end
  end

  def add_all_plausible_goals
    ALL_GOALS.each do |goal|
      add_plausible_goal(goal)
      sleep(0.001)
    end
  end

  def add_plausible_goal(event_name)
    return unless ENV['PLAUSIBLE_BASE_URL'] && ENV['PLAUSIBLE_API_KEY']

    uri = URI.parse(ENV['PLAUSIBLE_EVENT_BASE_URL'])

    username = uri.user
    password = uri.password

    auth = Base64.strict_encode64("#{username}:#{password}")

    plausible_url = "https://#{ENV['PLAUSIBLE_BASE_URL'].split('@')[1]}"
    options = {
      site_id: ENV['PLAUSIBLE_SITE_NAME'],
      goal_type: 'event',
      event_name: event_name
    }

    response = HTTP.auth("Bearer #{ENV['PLAUSIBLE_API_KEY']}")
                  .headers(
                    'Authorization' => "Basic #{auth}",
                    'Content-Type' => 'multipart/form-data',
                    'User-Agent' => 'your priorities'
                  )
                  .put("#{plausible_url}sites/goals", form: options)

    if response.status != 200
      Rails.logger.error("Error in sending to plausible: #{response.status} #{response.body}")
      return response.status
    else
      return response.body.to_s
    end
  rescue => e
    Rails.logger.warn("No plausible base url or api key: #{e}")
    return nil
  end

  def add_plausible_event(event_name, work_data)
    if ENV['PLAUSIBLE_EVENT_BASE_URL'].nil? || ENV['PLAUSIBLE_API_KEY'].nil?
      Rails.logger.warn("No plausible base url or api key")
      return
    end

    user_agent = work_data[:body][:user_agent]
    url = work_data[:body][:url]
    screen_width = work_data[:body][:screen_width]
    referrer = work_data[:body][:referrer]
    ip_address = work_data[:body][:ip_address]

    community_id = nil
    project_id = nil
    external_id = nil
    use_url = url

    # Add the logic to fetch community_id, project_id, and external_id here

    in_props = work_data[:body][:props] || {}
    props = in_props.merge(
      questionId: work_data[:questionId],
      earlId: work_data[:earlId],
      earlName: work_data[:earlName],
      promptId: work_data[:promptId],
      userId: work_data[:userId],
      userLocale: work_data[:body][:userLocale],
      userAutoTranslate: work_data[:body][:userAutoTranslate],
    )

    puts "PROPS PROPS PROPS #{work_data[:body].inspect}}}"

    puts "PROPS PROPS PROPS #{props.inspect}}}"

    uri = URI.parse(ENV['PLAUSIBLE_EVENT_BASE_URL'])

    username = uri.user
    password = uri.password

    auth = Base64.strict_encode64("#{username}:#{password}")

    options = {
      headers: {
        'Authorization': "Basic #{auth}",
        'X-Forwarded-For': ip_address,
        'User-Agent': user_agent,
        'referer': referrer,
        'Content-Type': 'application/json'
      },
      json: {
        name: event_name,
        url: use_url,
        domain: ENV['PLAUSIBLE_SITE_NAME'],
        screen_width: screen_width.to_i,
        referrer: referrer,
        referer: referrer,
        props: props.to_json
      }
    }

    response = HTTP.post("#{ENV['PLAUSIBLE_EVENT_BASE_URL']}event/", options)

    puts "API API API #{response.inspect}"

    if response.status != 202
      if response.status == 403
        Rails.logger.warn("Got 403 from plausible for #{ip_address} Plausible #{event_name} - #{props.to_json} - #{use_url} - #{referrer} -#{user_agent}")
      else
        Rails.logger.error("Error in sending to plausible #{response.status} #{response.body.to_s} #{ip_address} Plausible #{event_name} - #{props.to_json} - #{use_url} - #{referrer} -#{user_agent}")
        raise StandardError, "Error in sending to plausible #{response.status}"
      end
    end
  end

  def delayed_create_activity_from_app(work_data)
    if ENV['PLAUSIBLE_API_KEY']
      begin
        add_plausible_event(work_data[:body][:type], work_data)
      rescue => error
        Rails.logger.error("Error adding Plausible event: #{error}")
      end
    else
      Rails.logger.warn("No plausible api key")
    end
  end
end
