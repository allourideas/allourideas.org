#if ENV['HOPTOAD_API_KEY']
  HoptoadNotifier.configure do |config|
    config.api_key = 'a3047d4d5791fa2298cd52c42fd7231d'#ENV['HOPTOAD_API_KEY']
  end
#end
