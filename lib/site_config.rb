class SiteConfig
  def self.set_pairwise_credentials(photocracy = false)
    if photocracy
      username = ENV["PHOTOCRACY_USERNAME"]
      password = ENV["PHOTOCRACY_PASSWORD"]
    else
      username = ENV["PAIRWISE_USERNAME"]
      password = ENV["PAIRWISE_PASSWORD"]
    end
    active_resource_classes = [Choice, Density, Prompt, Question, Session]
    active_resource_classes.each do |klass|
      klass.user = username
      klass.password = password
    end
  end
end
