ActionController::Routing::Routes.draw do |map|
  #map.root :controller => "clearance/sessions", :action => "new"
  map.resources :questions,  :member => {:skip => :post, :vote_left => :post, :vote_right => :post, :add_idea => :post, :results => :get}
  map.connect '/questions/:question_id/choices/:id', :controller => 'choices', :action => 'show'
  map.about '/about', :controller => 'home', :action => 'about'
  map.privacy '/privacy', :controller => 'home', :action => 'privacy'
  map.tour '/tour', :controller => 'home', :action => 'tour'
  map.root :controller => 'home', :action => 'index'
  
  map.connect '/:id', :controller => 'earls', :action => 'show'
  map.connect '/:id/:action', :controller => 'earls'

  # rake routes
  # http://guides.rubyonrails.org/routing.html
end
