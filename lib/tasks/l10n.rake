namespace :l10n do

  # flattens the yaml hash into 1 dimensional hash
  def flatten(hash, namespace=nil)
    flattened = {}
    namespace = namespace + ':' if namespace
    hash.each do |key, value|
      if value.class == Hash
        flattened.merge!(flatten(value, "#{namespace}#{key}"))
      else
        flattened["#{namespace}#{key}"] = value
      end
    end
    return flattened
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
end
