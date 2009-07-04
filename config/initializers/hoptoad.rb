if ENV['HOPTOAD_API_KEY']
  HoptoadNotifier.configure do |config|
    config.api_key = ENV['HOPTOAD_API_KEY']
  end
end
