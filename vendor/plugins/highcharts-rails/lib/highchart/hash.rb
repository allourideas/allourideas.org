class Hash
  
  # extend the Hash class to allow for recursive merging
  def merge_recursive(hash)
    result = dup
    
    hash.keys.each do |key|
      if hash[key].is_a?(Hash) and self[key].is_a?(Hash)
        result[key] = result[key].deep_merge(hash[key])
        next
      end
      
      result[key] = hash[key]
    end
    
    # return the merged result hash
    result
  end
end