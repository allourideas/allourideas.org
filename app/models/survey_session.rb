class SurveySession
  @@verifier = ActiveSupport::MessageVerifier.new(APP_CONFIG[:SURVEY_SESSION_SECRET])
  @@expire_time = 10.minutes
  @@cookie_prefix = "aoi_"

  attr_reader :cookie_name, :old_session_id

  def initialize(data, cookie_name=nil)
    @data, @cookie_name = data, cookie_name

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

  def appearance_lookup=(appearance_id)
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
    # Get list of cookie names that  might be a match for this request.
    # Sort this list, so that when returning the first cookie matched it is consistent.
    possible_keys = cookies.keys.select do |k|
      # The cookie name must have this prefix.
      k.index("#{@@cookie_prefix}#{question_id}_") == 0
    end.sort

    if possible_keys.length == 0
      raise CantFindSessionFromCookies, 'No possible keys available'
    elsif possible_keys.length == 1
      begin
        # Extract data from cookie in a way that ensures no user tampering.
        data = @@verifier.verify(cookies[possible_keys[0]])
        # Safe guard against unexpected value of cookie data.
        raise CantFindSessionFromCookies, 'Data is not hash' if data.class != Hash
        # The question_id in the cookie_name could be altered by the user. To
        # protect against tampering, we verify the question_id in the cookie
        # value matches the one we're looking for.
        raise CantFindSessionFromCookies, "Question ID did not match cookie name" if data[:question_id].to_i != question_id.to_i
        # If no appearance_lookup, in request we don't need to check it.
        return [data, possible_keys[0]] if appearance_lookup.nil?
        if data[:appearance_lookup] == appearance_lookup
          return [data, possible_keys[0]]
        else
          raise CantFindSessionFromCookies, 'Only possible key did not have valid appearance lookup'
        end
      rescue ActiveSupport::MessageVerifier::InvalidSignature
        raise CantFindSessionFromCookies, 'Possible key failed verification'
      end
    else
      possible_keys.each do |possible_key|
        begin
          # Extract data from cookie in a way that ensures no user tampering.
          data = @@verifier.verify(cookies[possible_key])
          # Safe guard against unexpected value of cookie data.
          raise CantFindSessionFromCookies, 'Data is not hash' if data.class != Hash
          # The question_id in the cookie_name could be altered by the user. To
          # protect against tampering, we verify the question_id in the cookie
          # value matches the one we're looking for.
          raise CantFindSessionFromCookies, 'Question ID did not match cookie name' if data[:question_id].to_i != question_id.to_i
          return [data, possible_key] if appearance_lookup.nil?
          if data[:appearance_lookup] == appearance_lookup
            return [data, possible_key]
          end
        # We'll allow verification failures as other cookies match.
        rescue ActiveSupport::MessageVerifier::InvalidSignature
        end
      end
      if appearance_lookup.nil?
        raise CantFindSessionFromCookies, 'All possible keys failed verification'
      else
        raise CantFindSessionFromCookies, 'No key found valid with appearance_lookup'
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
