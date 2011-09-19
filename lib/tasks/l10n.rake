namespace :l10n do
  desc "Determine diff of keys between two yml files.  Call by keys_diff[filename1, filename2]"
  task :keys_diff, :file1, :file2 do |t, args|
    file1 = YAML::load(File.open(args[:file1]))
    file2 = YAML::load(File.open(args[:file2]))


    def recurse_keys(hash, namespace=nil)
      keys = []
      namespace = namespace + ':' if namespace
      hash.each do |key, value|
        if value.class == Hash
          keys = keys + recurse_keys(value, "#{namespace}#{key}")
        end
        keys << "#{namespace}#{key}"
      end
      return keys
    end

    file1_keys = recurse_keys(file1.first.second)
    file2_keys = recurse_keys(file2.first.second)
    puts "Keys in #{args[:file2]} that are missing in #{args[:file1]}:"
    puts (file2_keys - file1_keys)
    puts "\n\nKeys in #{args[:file1]} that are missing in #{args[:file2]}:"
    puts (file1_keys - file2_keys)

  end
end
