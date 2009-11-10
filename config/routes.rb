ActionController::Routing::Routes.draw do |map|
  #map.root :controller => "clearance/sessions", :action => "new"
  map.resources :questions,  :member => {:vote_left => :post, :vote_right => :post}
  
  map.about '/about', :controller => 'home', :action => 'about'
  map.privacy '/privacy', :controller => 'home', :action => 'privacy'
  map.tour '/tour', :controller => 'home', :action => 'tour'
  map.root :controller => 'home', :action => 'index'

  # rake routes
  # http://guides.rubyonrails.org/routing.html
end
