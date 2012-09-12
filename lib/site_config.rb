class SiteConfig
  def self.set_pairwise_credentials(photocracy=false)
    if photocracy
       username = APP_CONFIG[:PHOTOCRACY_USERNAME]
       password = APP_CONFIG[:PHOTOCRACY_PASSWORD]
    else
       username = APP_CONFIG[:PAIRWISE_USERNAME]
       password = APP_CONFIG[:PAIRWISE_PASSWORD]
    end
    active_resource_classes = [Choice, Density, Prompt, Question, Session]
    active_resource_classes.each do |klass|
      klass.user = username
      klass.password = password
    end
  end
end
