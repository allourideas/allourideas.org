class SurveySession
  @@verifier = ActiveSupport::MessageVerifier.new(APP_CONFIG[:SURVEY_SESSION_SECRET])
  @@expire_time = 10.minutes
  @@cookie_prefix = "aoi_"

  attr_reader :cookie_name, :old_session_id

  def initialize(data, cookie_name=nil)
    @data, @cookie_name = data, cookie_name

    if @cookie_name.nil?
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

  def regenerate
    @old_session_id = @data[:session_id]
    @data[:session_id] = generate_session_id
  end

  def cookie_value
    @@verifier.generate(@data)
  end

  def self.find(cookies, question_id, appearance_lookup=nil)
    possible_keys = cookies.keys.select do |k|
      k.index("#{@@cookie_prefix}#{question_id}_") == 0
    end.sort

    if possible_keys.length == 0
      raise CantFindSessionFromCookies, 'No possible keys available'
    elsif possible_keys.length == 1
      begin
        data = @@verifier.verify(cookies[possible_keys[0]])
        raise CantFindSessionFromCookies, 'Data is not hash' if data.class != Hash
        raise CantFindSessionFromCookies, "Question ID did not match cookie name" if data[:question_id].to_i != question_id.to_i
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
          data = @@verifier.verify(cookies[possible_key])
          raise CantFindSessionFromCookies, 'Data is not hash' if data.class != Hash
          raise CantFindSessionFromCookies, 'Question ID did not match cookie name' if data[:question_id].to_i != question_id.to_i
          return [data, possible_key] if appearance_lookup.nil?
          if data[:appearance_lookup] == appearance_lookup
            return [data, possible_key]
          end
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
    return 'test123' if Rails.env == 'test'
    ActiveSupport::SecureRandom.hex(16)
  end

end
class CantFindSessionFromCookies < StandardError
end
