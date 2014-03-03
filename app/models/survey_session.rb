class SurveySession
  @@verifier = ActiveSupport::MessageVerifier.new(APP_CONFIG[:SURVEY_SESSION_SECRET])
  @@expire_time = 10.minutes
  @@cookie_prefix = "aoi_"

  attr_reader :cookie_name, :old_session_id

  def initialize(data, cookie_name=nil)
    @data, @cookie_name = data, cookie_name

    # Clean up question_id to ensure it is either a positive integer or nil.
    if !@data.has_key?(:question_id)
      @data[:question_id] = nil
    end
    if !@data[:question_id].nil?
      q_id = @data[:question_id].to_i
      if q_id < 1
        raise QuestionIdIsNotPositiveInteger, "Question id must be positive integer or nil"
      end
      @data[:question_id] = q_id
    end

    if @cookie_name.nil?
      # Session is scoped to the question_id, so include that in the name of the
      # cookie. Random portion at end of the cookie_name allows a user to make
      # simultaneous requests and ensures that neither cookies gets overwritten
      # by whichever request completes last.
      @cookie_name = "#{@@cookie_prefix}#{@data[:question_id]}_#{ActiveSupport::SecureRandom.hex(2)}"
    end

    if @data[:session_id].nil?
      @data[:session_id] = generate_session_id
    end
    if @data[:expiration_time].nil?
      update_expiry
    end
  end

  def session_id
    @data[:session_id]
  end

  def appearance_lookup
    @data[:appearance_lookup]
  end

  def question_id
    @data[:question_id]
  end

  def appearance_lookup=(appearance_id)
    if @data[:question_id].nil?
      raise SessionHasNoQuestionId, "Can't set appearance_id when session has no question_id"
    end
    @data[:appearance_lookup] = appearance_id
  end

  def expired?
    @data[:expiration_time] < Time.now.utc
  end

  def update_expiry
    @data[:expiration_time] = @@expire_time.from_now.utc
  end

  # Creates a new session_id, but saves the old session_id. This is useful for
  # expired sessions where we want to send both new and old session_ids to
  # pairwise.
  def regenerate
    @old_session_id = @data[:session_id]
    @data[:session_id] = generate_session_id
  end

  # Creates signed cookie data to prevent user tampering.
  def cookie_value
    @@verifier.generate(@data)
  end

  # Given a hash of cookies, a question_id, and appearance_lookup,
  # return the cookie data and cookie name in an array that best matches.
  # If there are multiple cookies that match, we return the first that is matched.
  def self.find(cookies, question_id, appearance_lookup=nil)
    if question_id.to_i < 1 && !appearance_lookup.nil?
      raise SessionHasNoQuestionId, "Can't find session with appearance_lookup that has no question_id"
    end
    # Get list of cookie names that  might be a match for this request.
    # Sort this list, so that when returning the first cookie matched it is consistent.
    possible_cookie_names = cookies.keys.select do |k|
      # The cookie name must have this prefix.
      k.index("#{@@cookie_prefix}#{question_id}_") == 0
    end.sort

    if possible_cookie_names.length == 0
      raise CantFindSessionFromCookies, 'No possible cookies available'
    else
      possible_cookie_names.each do |cookie_name|
        begin
          # Extract data from cookie in a way that ensures no user tampering.
          data = @@verifier.verify(cookies[cookie_name])
          # Safe guard against unexpected value of cookie data.
          raise CantFindSessionFromCookies, 'Data is not hash' if data.class != Hash
          # The question_id in the cookie_name could be altered by the user. To
          # protect against tampering, we verify the question_id in the cookie
          # value matches the one we're looking for.
          raise CantFindSessionFromCookies, 'Question ID did not match cookie name' if data[:question_id].to_i != question_id.to_i
          # If appearance_lookup is nil, we can return now because we've found
          # the first cookie that is match. There may be other matches, but we
          # have no way to determine which might be best. We always return the
          # first matching cookie for this search.
          return [data, cookie_name] if appearance_lookup.nil?
          if data[:appearance_lookup] == appearance_lookup
            return [data, cookie_name]
          end
        # We'll allow verification failures as other cookies match.
        rescue ActiveSupport::MessageVerifier::InvalidSignature
        end
      end
      # If we've gotten this far, we've failed to find a cookie.
      if appearance_lookup.nil?
        raise CantFindSessionFromCookies, 'All possible cookies failed verification'
      else
        raise CantFindSessionFromCookies, 'No cookie found valid with appearance_lookup'
      end
    end

  end

  protected
  def generate_session_id
    # ActiveResource::HttpMock only matches static strings for query parameters
    # when in test set this to a static value, so we can match the resulting API
    # queries for mocking.
    return 'test123' if Rails.env == 'test'
    ActiveSupport::SecureRandom.hex(16)
  end

end
class CantFindSessionFromCookies < StandardError
end
class SessionHasNoQuestionId < StandardError
end
class QuestionIdIsNotPositiveInteger < StandardError
end
