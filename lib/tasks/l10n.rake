namespace :l10n do

  # flattens the yaml hash into 1 dimensional hash
  def flatten(hash, namespace=nil)
    flattened = {}
    namespace = namespace + '.' if namespace
    hash.each do |key, value|
      if value.class == Hash
        flattened.merge!(flatten(value, "#{namespace}#{key}"))
      else
        flattened["#{namespace}#{key}"] = value
      end
    end
    return flattened
  end

  # given a nested hash and key as string, find the value
  # key can be indicate nesting by being dot separated
  def getValue(hash, key)
    key.to_s.split('.').inject(hash) { |h, k| h[k] unless h.nil? }
  end

  # set a value in the hash given a string as key much like getValue
  def setValue(hash, key, value)
    subkeys = key.split('.')
    lastkey = subkeys.pop
    subhash = subkeys.inject(hash) do |h, k|
      h[k] = {} if h[k].nil? 
      h[k]
    end
    subhash[lastkey] = value
  end

  desc "Determine diff of keys between two yml files.  Call by keys_diff[filename1, filename2]"
  task :keys_diff, :file1, :file2 do |t, args|
    file1 = YAML::load(File.open(args[:file1]))
    file2 = YAML::load(File.open(args[:file2]))

    # ignore language designation, so start with first.second
    file1_keys = flatten(file1.first.second).keys
    file2_keys = flatten(file2.first.second).keys
    puts "Keys in #{args[:file2]} that are missing in #{args[:file1]}:"
    puts (file2_keys - file1_keys).sort
    puts "\n\nKeys in #{args[:file1]} that are missing in #{args[:file2]}:"
    puts (file1_keys - file2_keys).sort

  end

  task :get_english_yaml, :file1, :file2, :en_file do |t, args|
    file1 = YAML::load(File.open(args[:file1]))
    file2 = YAML::load(File.open(args[:file2]))
    en    = YAML::load(File.open(args[:en_file])).first.second

    # ignore language designation, so start with first.second
    file1_keys = flatten(file1.first.second).keys
    file2_keys = flatten(file2.first.second).keys
    newHash = {}
    (file2_keys - file1_keys).each do |key|
      value = getValue(en, key)
      setValue(newHash, "#{file1.first.first}.#{key}", value)
    end
    puts newHash.to_yaml
  end
end
