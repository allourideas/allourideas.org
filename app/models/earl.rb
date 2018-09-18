class Earl < ActiveRecord::Base
  @@reserved_names = ["questions", "question", 'about', 'privacy', 'tour', 'no_google_tracking', 'admin', 'abingo', 'earls', 'signup', 'sign_in', 'sign_out','clicks', 'fakequestion', 'photocracy', 'fotocracy']
  validates_presence_of :question_id, :on => :create, :message => "can't be blank"
  validates_presence_of :name, :on => :create, :message => "can't be blank"
  validates_exclusion_of :name, :in => @@reserved_names, :message => "'%{value}' is reserved"
  validates_format_of :name, :on => :create, :with => /\A[a-zA-Z0-9\.\-\_]+\z/, :message => "allows only 'A-Za-z0-9.-_' characters"
  validates_uniqueness_of :name, :case_sensitive => false
  validates_length_of :welcome_message, :maximum=>350, :allow_nil => true, :allow_blank => true
  has_friendly_id :name, :reserved => @@reserved_names
  has_attached_file :logo, :whiny_thumbnails => true, :styles => { :banner => "450x47>", :medium => "150x150>" }

  attr_accessor :ideas
  before_create :require_verification!, :if => :ideas_look_spammy?

  belongs_to :user

  def self.reserved_names
    @@reserved_names
  end

  def question
    @question ||= Question.find(self.question_id)
  end

  def hide_results
    !question.show_results?
  end

  def hide_results=(value)
    question.show_results = !ActiveRecord::ConnectionAdapters::Column.value_to_boolean(value)
    question.save
  end

  def question_should_autoactivate_ideas
    question.it_should_autoactivate_ideas
  end

  def ideas_look_spammy?
    return false unless ideas
    return true if ideas.match(/https?:/)
    return false
  end

  def verify!(code)
    return true unless self.requires_verification?
    if code == verify_code
      self.verify_code = nil
      self.active = true
      return self.save
    else
      return false
    end
  end

  def allows_voting?
    return self.active? && !self.requires_verification?
  end

  def requires_verification?
    return self.verify_code.present?
  end

  def require_verification!
    self.active = false
    self.verify_code = SecureRandom.hex(8)
  end

  def question_should_autoactivate_ideas=(value)
    question.it_should_autoactivate_ideas = ActiveRecord::ConnectionAdapters::Column.value_to_boolean(value)
    question.save
  end

  def self.voter_map(earl_name, type)
    if type == "all"
      votes_by_sids = Question.get(:all_num_votes_by_visitor_id, :scope => "all_votes")
    elsif type == 'all_photocracy_votes'
      votes_by_sids = Question.get(:all_num_votes_by_visitor_id, :scope => type)
    elsif type == 'all_aoi_votes'
      votes_by_sids = Question.get(:all_num_votes_by_visitor_id, :scope => type)
    elsif type == "all_creators"
      votes_by_sids = Question.get(:all_num_votes_by_visitor_id, :scope => "creators")
    elsif type == "uploaded_ideas"
         
      earl = Earl.find earl_name
      question = Question.new
      question.id = earl.question_id
      votes_by_sids = question.get(:object_info_by_visitor_id, :object_type => 'uploaded_ideas')
    elsif type == "bounces"
      earl = Earl.find earl_name
      question = Question.new
      question.id = earl.question_id
      votes_by_sids = question.get(:object_info_by_visitor_id, :object_type => 'bounces')

    elsif type == "votes"
      earl = Earl.find earl_name
      question = Question.new
      question.id = earl.question_id
      votes_by_sids = question.get(:object_info_by_visitor_id, :object_type => 'votes')
    end
     
    votes_by_geoloc= {}
    object_total = 0
    votes_by_sids.each do |vote|
      sid = vote["visitor_id"]
      num_votes = vote["count"]
      num_votes = num_votes.to_i
      session = SessionInfo.find_by_session_id(sid)

      if type == "bounces" &&  session.clicks.size > 1
        next
      end

      object_total += num_votes
      if session.nil? || session.loc_info.nil? 
        if votes_by_geoloc["Unknown Location"].nil?
          votes_by_geoloc["Unknown Location"] = {}
          votes_by_geoloc["Unknown Location"][:num_votes] = num_votes
        else 
          votes_by_geoloc["Unknown Location"][:num_votes] += num_votes
        end

        next
      end

   #   if session.loc_info.empty?
   #     loc = Geokit::Geocoders::MultiGeocoder.geocode(session.ip_addr)
   #     if loc.success
   #       session.loc_info= {}
   #       session.loc_info[:city] = loc.city
   #       session.loc_info[:state] = loc.state
   #       session.loc_info[:country] = loc.country
   #       session.loc_info[:lat] = loc.lat
   #       session.loc_info[:lng] = loc.lng
   #       session.save
   #     end
   #   end
       
      if !session.loc_info.empty?
        display_fields = [:city, :region, :country_code]

        display_text = []
        display_fields.each do|key|
          if session.loc_info[key]
            begin
              if !(/^[0-9]+$/ =~ session.loc_info[key])
                display_text << session.loc_info[key]
              end
            rescue ArgumentError
            end
          end
        end

        city_state_string = display_text.join(", ")
        if votes_by_geoloc[city_state_string].nil?
          votes_by_geoloc[city_state_string] = {}
          votes_by_geoloc[city_state_string][:lat] = session.loc_info[:latitude]
          votes_by_geoloc[city_state_string][:lng] = session.loc_info[:longitude]
          votes_by_geoloc[city_state_string][:num_votes] = num_votes
        else
          votes_by_geoloc[city_state_string][:num_votes] += num_votes
        end
      else
        if votes_by_geoloc["Unknown Location"].nil?
          votes_by_geoloc["Unknown Location"] = {}
          votes_by_geoloc["Unknown Location"][:num_votes] = num_votes
        else 
          votes_by_geoloc["Unknown Location"][:num_votes] += num_votes
        end
      end
    end

    return {:total => object_total, :votes_by_geoloc => votes_by_geoloc }
  end

  def munge_csv_data(csvdata, type)
    #Caching these to prevent repeated lookups for the same session, Hackish, but should be fine for background job
    sessions = {}

    Enumerator.new do |y|
      CSVBridge.parse(csvdata, {:headers => :first_row, :return_headers => true}) do |row|

        if row.header_row?
          if photocracy
            if type == 'votes'
              row << ['Winner Photo Name', 'Winner Photo Name']
              row << ['Loser Photo Name', 'Loser Photo Name']
            elsif type == 'non_votes'
              row << ['Left Photo Name', 'Left Photo Name']
              row << ['Right Photo Name', 'Right Photo Name']
            elsif type == 'ideas'
              row << ['Photo Name', 'Photo Name']
            end
          end

          case type
            when "votes", "non_votes"
              #We need this to look up SessionInfos, but the user doesn't need to see it
              row.delete('Session Identifier')

              row << ['Hashed IP Address', 'Hashed IP Address']
              row << ['URL Alias', 'URL Alias']
              row << ['User Agent', 'User Agent']
              row << ['Referrer', 'Referrer']
              row << ['Widget', 'Widget']
              row << ['Info', 'Info']
            when "ideas"
              row.delete('Session Identifier')
              row << ['Info', 'Info']
          end
          y.yield row.to_csv
        else
          if photocracy
            if    type == 'votes'
              p1 = Photo.find_by_id(row['Winner Text'])
              p2 = Photo.find_by_id(row['Loser Text'])
              row << [ 'Winner Photo Name', p1 ? p1.photo_name : 'NA' ]
              row << [ 'Loser Photo Name',  p2 ? p2.photo_name : 'NA' ]
            elsif type == 'non_votes'
              p1 = Photo.find_by_id(row['Left Choice Text'])
              p2 = Photo.find_by_id(row['Right Choice Text'])
              row << [ 'Left Photo Name',  p1 ? p1.photo_name : 'NA' ]
              row << [ 'Right Photo Name', p2 ? p2.photo_name : 'NA' ]
            elsif type == 'ideas'
              p1 = Photo.find_by_id(row['Idea Text'])
              row << [ 'Photo Name', p1 ? p1.photo_name : 'NA' ]
            end
          end

          case type
            when 'ideas'
              sid = row['Session Identifier']
              row.delete('Session Identifier')
              user_session = sessions[sid]
              if user_session.nil?
                user_session = SessionInfo.find_by_session_id(sid)
                sessions[sid] = user_session
              end
              unless user_session.nil?
                info = user_session.find_info_value(row)
                info = 'NA' unless info
                row << ['Info', info]
              end
            when "votes", "non_votes"

              sid = row['Session Identifier']
              row.delete('Session Identifier')

              user_session = sessions[sid]
              if user_session.nil?
                user_session = SessionInfo.find_by_session_id(sid)
                sessions[sid] = user_session
              end

              unless user_session.nil? #edge case, all appearances and votes after april 8 should have session info
                url_alias = self.name

                row << ['Hashed IP Address', Digest::MD5.hexdigest([user_session.ip_addr, APP_CONFIG[:IP_ADDR_HASH_SALT]].join(""))]
                row << ['URL Alias', url_alias]
                row << ['User Agent', user_session.user_agent]

                # grab most recent referrer from clicks
                # that is older than this current vote
                # and belongs to this earl
                conditions = ["controller = 'earls' AND action = 'show' AND created_at < ? AND (url like ?)", row['Created at'], "%/#{self.name}%"]
                session_start = user_session.clicks.find(:first, :conditions => conditions, :order => 'created_at DESC')
                referrer = (session_start) ? session_start.referrer : 'REFERRER_NOT_FOUND'
                referrer = 'DIRECT_VISIT' if referrer == '/'
                # we've had some referrers be UTF-8, rest of CSV is ASCII-8BIT
                row << ['Referrer', referrer]

                vote_click = user_session.find_click_for_vote(row)
                widget = (vote_click.widget?) ? 'TRUE' : 'FALSE'
                row << ['Widget', widget]

                info = user_session.find_info_value(row)
                info = 'NA' unless info
                row << ['Info', info]

              end
          end
          y.yield row.to_csv
        end
      end
    end
  end

end
