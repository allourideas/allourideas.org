module AllOurIdeas
  // This SQL is needed to allow the site API
  // UPDATE api_keys SET scopes = '{sites:provision:*}' WHERE name = 'Development';

  all_goals = [
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

  def getFromAnalyticsApi(req, featureType, collectionType, collectionId, done)
    options = {
      url: ENV['PLAUSIBLE_BASE_URL'] + featureType + '/' + collectionType + '/' + ENV['AC_ANALYTICS_CLUSTER_ID'] + '/' + collectionId,
      headers: {
        'X-API-KEY': ENV['PLAUSIBLE_API_KEY']
      }
    }

    request.get(options, (error, content) => {
      if content && content.statusCode != 200
        error = content.statusCode
      else
        #resolve()
      end
      done(error, content)
    })
  end

  def plausible_stats_proxy(plausible_url, props)
    if !ENV["PLAUSIBLE_BASE_URL"].nil? && !ENV["PLAUSIBLE_API_KEY"].nil?
      first_part_of_url = plausible_url.split("?")[0]
      search_params = URI.decode_www_form(plausible_url.split("?")[1])
      filters_content = ""
      base_url = ""

      base_url = ENV["PLAUSIBLE_BASE_URL"].gsub("/api/v1/", "")

      if plausible_url.index("timeseries") > -1 || plausible_url.index("aggregate") > -1
        custom_property_name = props.keys[0]
        custom_property_value = props.values[0]
        filters_content = search_params["filters"]
        filters_content = "#{filters_content};event:props:#{custom_property_name}==#{custom_property_value}"
        search_params["filters"] = filters_content
        #search_params.delete('metrics');
        #search_params.set('metrics', 'visitors')
        search_params.delete("with_imported")
        period = search_params["period"]
        if period == "all"
          search_params.delete("date")
          search_params["period"] = "custom"
          stats_begin_time = moment(search_params["statsBegin"])
          plausible_begin_time = moment("2022-08-13")
          being_time = ""

          if stats_begin_time<plausible_begin_time
            being_time = plausible_begin_time.format("YYYY-MM-DD")
          else
            being_time = stats_begin_time.format("YYYY-MM-DD")
          end
          date_now = moment(DateTime.now).format("YYYY-MM-DD")
          search_params["date"] = "#{being_time},#{date_now}"
        end
        search_params.delete("statsBegin")
        base_url = "https://#{base_url.split("@")[1]}"
      else
        filters_content = JSON.parse(search_params["filters"])

        if first_part_of_url.index("/property/") > -1
          props = {}
        end

        filters_content = filters_content.merge(props)

        search_params["filters"] = filters_content.to_json
      end

      new_url = "#{first_part_of_url}?#{search_params.to_h.to_query}"

      options = {
        url: base_url+ new_url,
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.3",
          referrer: "",
          Authorization: "Bearer #{ENV["PLAUSIBLE_API_KEY"]}",
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }

      log.debug(options.to_json)

      response = RestClient.get(options[:url], options[:headers])
      if response.code != 200
        log.error(response)
        return response.code
      else
        if response
          log.debug(response.body)
          return response.body
        else
          return "No body for plausible content"
        end
      end
    else
      log.warn("No plausible base url or api key")
      return
    end
  end

  def get_plausible_stats(stats_params)
    return Promise.new { |resolve, reject|
      if ENV["PLAUSIBLE_BASE_URL"] && ENV["PLAUSIBLE_API_KEY"]
        options = {
          url: ENV["PLAUSIBLE_BASE_URL"] + "stats/" + stats_params,
          headers: {
            "X-Forwarded-For": "127.0.0.1",
            "Content-Type": "application/json",
            Authorization: "Bearer #{ENV["PLAUSIBLE_API_KEY"]}",
          },
        }

        log.info(JSON.stringify(options))

        request.get(options) { |error, content|
          if content && content.status_code != 200
            log.error(error)
            log.error(content)
            reject(content.status_code)
          else
            console.log(content.body)
            resolve(content.body)
          end
        }
      else
        log.warn("No plausible base url or api key")
        resolve()
      end
    }
  end

  def addAllPlausibleGoals
    for i in 0..allGoals.length
      addPlausibleGoal(allGoals[i])
      await new Promise(r => setTimeout(r, 1))
    end
  end


  def addPlausibleGoal(eventName)
    if ENV["PLAUSIBLE_BASE_URL"] && ENV["PLAUSIBLE_API_KEY"]
      plausibleUrl = "https://#{ENV["PLAUSIBLE_BASE_URL"].split("@")[1]}"
      options = {
        url: plausibleUrl + "sites/goals",
        formData: {
          site_id: ENV["PLAUSIBLE_SITE_NAME"],
          goal_type: "event",
          event_name: eventName
        },
        headers: {
          Authorization: "Bearer #{ENV["PLAUSIBLE_API_KEY"]}",
          "Content-Type": "multipart/form-data",
          "User-Agent": "your priorities"
          #"X-Forwarded-For": "127.0.0.1",
        },
        method: "PUT",
      }

      puts "#{options.to_json}"

      response = HTTParty.put(options[:url], :body => options[:formData], :headers => options[:headers])
      puts response
      response.body
    else
      puts "No plausible base url or api key"
    end
  end


  def addPlausibleEvent(
    eventName,
    workData
  )
    userAgent = workData.body.user_agent
    url = workData.body.url
    screenWidth = workData.body.screen_width
    referrer = workData.body.referrer
    ipAddress = workData.body.ipAddress

    return new Promise(async (resolve, reject) => {
      if (
        process.env["PLAUSIBLE_EVENT_BASE_URL"] &&
        process.env["PLAUSIBLE_API_KEY"]
      )
        communityId = nil
        projectId, externalId = nil
        useUrl = url

        begin
          if !communityId && workData[:groupId]
            group = await models.Group.where(id: workData[:groupId]).select(:community_id).first

            if group
              communityId = group[:community_id]
            end
          end

          if !communityId && workData[:postId]
            post = await models.Post.where(id: workData[:postId]).select(:id).includes(models.Group.select(:community_id).required(true)).first

            if post
              communityId = post[:Group][:community_id]
            end
          end

          if !communityId && workData[:communityId]
            communityId = workData[:communityId]
          end

          if !workData[:groupId] && workData[:postId]
            post = await models.Post.where(id: workData[:postId]).select(:group_id).first

            if post
              workData[:groupId] = post[:group_id]
            end
          end

          if workData[:body][:originalQueryString] && useUrl.index("?").nil?
            useUrl += "?" + workData[:body][:originalQueryString]
          end

          if workData[:body][:userAutoTranslate] && workData[:body][:userAutoTranslate].is_a?(String)
            workData[:body][:userAutoTranslate] = workData[:body][:userAutoTranslate].downcase == 'true'
          end
          if communityId
            community = await models.Community.findOne({
              where: {
                id: communityId
              },
              attributes: ['id','configuration']
            });

            if community && community.configuration
              projectId = community.configuration.projectId
              externalId = community.configuration.externalId
            end
          end
        rescue => error
          reject(error)
          return
        end

        inProps = workData.body.props ?  workData.body.props : {}

        props = {
          ...inProps,
          ...{
            communityId: communityId ? parseInt(communityId) : nil,
            groupId: workData.groupId ? parseInt(workData.groupId) : nil,
            domainId: workData.domainId ? parseInt(workData.domainId) : nil,
            postId: workData.postId ? parseInt(workData.postId) : nil,
            pointId: workData.pointId ? parseInt(workData.pointId) : nil,
            userId: workData.userId ? parseInt(workData.userId) : -1,
            userLocale: workData.body.userLocale,
            userAutoTranslate: workData.body.userAutoTranslate,
            projectId: projectId,
            externalId: externalId
          }
        }

        options = {
          url: process.env["PLAUSIBLE_EVENT_BASE_URL"] + "event/",
          headers: {
            "X-Forwarded-For": ipAddress,
            "User-Agent": userAgent,
            "referer": referrer,
            "Content-Type": "application/json",
          },
          method: "POST",
          json: {
            name: eventName,
            url: useUrl,
            domain: process.env["PLAUSIBLE_SITE_NAME"],
            screen_width: parseInt(screenWidth),
            referrer: referrer,
            referer: referrer,
            props: JSON.stringify(props),
          },
        }

        #log.info(JSON.stringify(options));
        logLine = "#{ipAddress} Plausible #{eventName} - #{JSON.stringify(props)} - #{useUrl} - #{referrer} -#{userAgent}"
        log.debug(logLine)

        request.post(options, async (error, content) => {
          if content && content.statusCode != 202
            if content.statusCode == 403
              log.warn("Got 403 from plausible for #{logLine}")
              resolve()
            else
              log.error("Error in sending to plausible #{content.statusCode} #{content.error} #{logLine}")
              log.error(content)
              reject(content.statusCode)
            end
          else
            resolve()
          end
        })
      else
        log.warn("No plausible base url or api key")
        resolve()
      end
    })
  end

  def send_plausible_favicon(source_name)
    if ENV['PLAUSIBLE_BASE_URL'] && ENV['PLAUSIBLE_API_KEY']
      url = ENV['PLAUSIBLE_BASE_URL'].gsub('/api/v1/', '/favicon/sources/') + source_name
      options = {
        url: url,
        headers: {
          Authorization: "Bearer #{ENV['PLAUSIBLE_API_KEY']}",
          "Content-Type": "image/x-icon",
          "X-Forwarded-For": "127.0.0.1"
        },
        encoding: nil,
      }
      log.info(JSON.generate(options))
      content = HTTParty.get(url, options)
      if content && content.code != 200
        log.error(content)
        raise content.code
      else
        content.body
      end
    else
      log.warn('No plausible base url or api key')
    end
  end

end