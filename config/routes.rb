ActionController::Routing::Routes.draw do |map|
  #map.root :controller => "clearance/sessions", :action => "new"
  map.resources :questions,  :member => {:skip => :post, :vote_left => :post, :vote_right => :post, :add_idea => :post, :results => :get}
  #map.resources :choices, :member => {:activate => :get}
  map.connect '/questions/:question_id/choices/:id', :controller => 'choices', :action => 'show'
  map.activate_choice '/:question_id/choices/:id/activate', :controller => 'choices', :action => 'activate'
  map.about '/about', :controller => 'home', :action => 'about'
  map.privacy '/privacy', :controller => 'home', :action => 'privacy'
  map.tour '/tour', :controller => 'home', :action => 'tour'
  map.connect '/signup', :controller => 'users', :action => 'new'
  map.root :controller => 'home', :action => 'index'
  
  map.connect '/:id', :controller => 'earls', :action => 'show'
  map.connect '/:id/:action', :controller => 'questions'
  map.connect '/:question_id/choices/:id', :controller => 'choices', :action => 'show'

  # rake routes
  # http://guides.rubyonrails.org/routing.html
end
