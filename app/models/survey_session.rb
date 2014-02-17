class SurveySession
  @@verifier = ActiveSupport::MessageVerifier.new(APP_CONFIG[:SURVEY_SESSION_SECRET])

  def self.find(cookies, question_id, appearance_lookup=nil)
    possible_keys = cookies.keys.select do |k|
      k.index("aoi_#{question_id}_") == 0
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

end
class CantFindSessionFromCookies < StandardError
end
