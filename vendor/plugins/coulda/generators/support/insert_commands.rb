# Mostly pinched from http://github.com/ryanb/nifty-generators/tree/master

Rails::Generator::Commands::Base.class_eval do
  def file_contains?(relative_destination, line)
    File.read(destination_path(relative_destination)).include?(line)
  end
end

Rails::Generator::Commands::Create.class_eval do
  def insert_into(file, line)
    logger.insert "#{line} into #{file}"
    unless file_contains?(file, line)
      gsub_file file, /^(class|module|#{Coulda::Insertable.routes}) .+$/ do |match|
        "#{match}\n  #{line}"
      end
    end
  end

  def insert_cucumber_path(file, line)
    logger.insert "#{line} into #{file}"
    unless file_contains?(file, line)
      gsub_file file, /#{Coulda::Insertable.cucumber_paths}/ do |match|
        "#{match}\n#{line}"
      end
    end
  end
end

Rails::Generator::Commands::Destroy.class_eval do
  def insert_into(file, line)
    logger.remove "#{line} from #{file}"
    gsub_file file, "\n  #{line}", ''
  end
end

Rails::Generator::Commands::List.class_eval do
  def insert_into(file, line)
    logger.insert "#{line} into #{file}"
  end
end

module Coulda
  module Insertable
    def self.routes
      "ActionController::Routing::Routes.draw"
    end

    def self.cucumber_paths
      "case page_name\n"
    end
  end
end

