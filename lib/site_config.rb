class SiteConfig
  def self.set_pairwise_credentials(photocracy=false)
    if photocracy
       username = PHOTOCRACY_USERNAME
       password = PHOTOCRACY_PASSWORD
    else
       username = PAIRWISE_USERNAME
       password = PAIRWISE_PASSWORD
    end
    active_resource_classes = [Choice, Density, Prompt, Question, Session]
    active_resource_classes.each do |klass|
      klass.user = username
      klass.password = password
    end
  end
end
