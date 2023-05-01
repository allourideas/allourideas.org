require 'http'
require 'json'

module PlausibleHelper
  # Add other helper methods here
  ALL_GOALS = [
    "newPost - completed",
    "newPost - open",
    "pointHelpful - clicked",
    "pointHelpful - completed",
    "endorse_down - clicked",
    "endorse_down - completed",
    "pointDown - add",
    "pointDown - focus",
    "Login and Signup - Login Fail",
    "endorse_up - clicked",
    "endorse_up - completed",
    "Login and Signup - Signup/Login Opened",
    "Login and Signup - Signup Fail",
    "newPointFor - completed",
    "Login and Signup - Login Submit",
    "post.ratings - open",
    "Login and Signup - Signup Submit",
    "newPointAgainst - completed",
    "Login and Signup - Login Success",
    "Login and Signup - Signup Success",
    "pointUp - focus",
    "pages - open",
    "pointUp - add",
    "pointNotHelpful - clicked",
    "pointNotHelpful - completed",
    "mediaRecorder - open",
    "videoUpload - starting",
    "audioUpload - starting",
    "audioUpload - error",
    "videoUpload - error",
    "post - open",
    "postForward - swipe",
    "postBackward - swipe",
    "recommendations - goForward",
    "recommendations - goBack",
    "stopTranslation - click",
    "startTranslation - click",
    "changeLanguage - click",
    "video - completed",
    "audio - completed",
    "editCommunity - completed",
    "community.bulkStatusUpdates - open",
    "community.users - open",
    "community.admins - open",
    "community.pagesAdmin - open",
    "createReportXlsUsers - open",
    "createReportFraudReport - open",
    "communityContentModeration - open",
    "communityFraudManagement - open",
    "communityAllContentModeration - open",
    "community.delete - open",
    "community.deleteContents - open",
    "community.anonymize - open",
    "community.edit - open",
    "community_tab - open",
    "newGroup - open",
    "editDomain - completed",
    "domainUsers - open",
    "domainAdmins - open",
    "domain.organizationsGrid - open",
    "domain.pagesAdmin - open",
    "domainEdit - open",
    "domainContentModeration - open",
    "domainAllContentModeration - open",
    "organizationEdit - open",
    "domain_tab_communities - open",
    "domain_tab_news - open",
    "newCommunity - open",
    "newCommunityFolder - open",
    "ziggeo - open",
    "attachmentUpload - starting",
    "imageUpload - starting",
    "mediaTranscoding - starting",
    "mediaTranscoding - error",
    "videoUpload - complete",
    "audioUpload - complete",
    "imageUpload - complete",
    "mediaTranscoding - complete",
    "mediaUpload - error",
    "group - open",
    "groupContentModeration - open",
    "groupAllContentModeration - open",
    "group.pagesAdmin - open",
    "group.users - open",
    "group.admins - open",
    "group.edit - open",
    "createReportDocx - open",
    "createReportXls - open",
    "group.deleteContent - open",
    "group.clone - open",
    "community.clone - open",
    "group.anonymize - open",
    "category.new - open",
    "twitter - pointShareOpen",
    "group.delete - open",
    "group_tab_map - open",
    "toggleCommunityMembership - clicked",
    "facebook - pointShareOpen",
    "editGroup - complete",
    "group_tab_posts - open",
    "group_tab_news - open",
    "pages - close",
    "toggleGroupMembership - clicked",
    "community - open",
    "point.report - open",
    "email - pointShareOpen",
    "whatsapp - pointShareOpen",
    "twitter - postShareCardOpen",
    "facebook - postShareCardOpen",
    "email - postShareCardOpen",
    "whatsapp - postShareCardOpen",
    "post.report - open",
    "post.edit - open",
    "post.delete - open",
    "postDeleteContent - open",
    "postAnonymizeContent - open",
    "filter - click",
    "search - click",
    "marker - clicked",
    "userImage.edit - open",
    "userImage.delete - open",
    "newUserImage - open",
    "post_tab_debate - open",
    "post_tab_map - open",
    "post_tab_news - open",
    "filter - open",
    "filter - change",
    "post.ratings - add",
    "post.ratings - delete",
    "post.ratings - completed",
    "post.ratings.dialog - open",
    "setEmail - cancel",
    "setEmail - logout",
    "forgotPasswordFromSetEmail - open",
    "linkAccountsAjax - confirm",
    "setEmail - confirm",
    "registrationAnswers - submit",
    "user.createApiKey - open",
    "user.reCreateApiKey - open",
    "userAllContentModeration - open",
    "evaluated - point toxicity low",
    "evaluated - point toxicity medium",
    "evaluated - point toxicity high",
    "evaluated - post toxicity low",
    "evaluated - post toxicity medium",
    "evaluated - post toxicity high",
    "open - share dialog options",
    "open - share dialog - brand:whatsapp",
    "open - share dialog - brand:facebook",
    "open - share dialog - brand:twitter",
    "open - share dialog - clipboard"

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

    new_url = "#{first_part_of_url}?#{search_params.to_query}"
    options = {
      headers: {
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

    plausible_url = "https://#{ENV['PLAUSIBLE_BASE_URL'].split('@')[1]}"
    options = {
      site_id: ENV['PLAUSIBLE_SITE_NAME'],
      goal_type: 'event',
      event_name: event_name
    }

    response = HTTP.auth("Bearer #{ENV['PLAUSIBLE_API_KEY']}")
                  .headers(
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
    #  communityId: community_id,
    #  groupId: work_data[:groupId],
    #  domainId: work_data[:domainId],
    #  postId: work_data[:postId],
    #  pointId: work_data[:pointId],
    #  userId: work_data[:userId],
    #  userLocale: work_data[:body][:userLocale],
    #  userAutoTranslate: work_data[:body][:userAutoTranslate],
    #  projectId: project_id,
    #  externalId: external_id
    )

    options = {
      headers: {
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
      plausible_event = if work_data[:body][:type] == "pageview"
                          "pageview"
                        elsif !work_data[:body][:useTypeNameUnchanged]
                          "#{work_data[:body][:object]} - #{work_data[:body][:type]}"
                        else
                          work_data[:body][:type]
                        end

      begin
        add_plausible_event(plausible_event, work_data)
      rescue => error
        Rails.logger.error("Error adding Plausible event: #{error}")
      end
    else
      Rails.logger.warn("No plausible api key")
    end
  end
end
