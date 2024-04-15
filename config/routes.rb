ActionController::Routing::Routes.draw do |map|
  map.resource :session, :controller => "clearance/sessions", :only => [:new, :create, :destroy]
  map.signin '/sign_in', :controller => "clearance/sessions", :action => :new
  map.signout '/sign_out', :controller => "clearance/sessions", :action => :destroy
  map.resource :passwords, :controller => "clearance/passwords"

  map.resources :questions,
    # no longer allowing new question creations
    :except => [:create],
    :collection => {
    },
    :member => {
      :update_name => :put,
      :add_idea => :post,
      :toggle => :post,
      :toggle_autoactivate => :post,
      :delete_logo => :delete,
      :addphotos => :get,
      :upload_photos => :post,
      :admin_stats => :get,
      :visitor_voting_history => :get
    } do |question|
	  question.resources :prompts, 
		  :only => [:vote, :skip, :flag],
		  :member => {
		  	:vote => :post,
			:skip => :post,
                        :flag => :post,
                  }
	  question.resources :choices, 
		  :only => [:show, :votes],
		  :member => {
		  	:activate => :get, # these shouldn't be get requests, but they need to work in email
        :deactivate => :get,
        :rotate => :post,
        :votes => :get
		  },
		  :path_prefix => '/:question_id'
	  end

  map.resources :earls, :only => [:export_list], :collection => {:export_list=> :get}
  map.resources :clicks, :collection => {:export=> :get}
  #map.connect '/questions/:question_id/choices/:id', :controller => 'choices', :action => 'show'
  map.toggle_choice_status '/questions/:earl_id/choices/:id/toggle.:format', :controller => 'choices', :action => 'toggle', :conditions => { :method => :post }
  
  map.cookies_blocked '/cookies_blocked.gif', :controller => 'home', :action => 'cookies_blocked'
  map.about '/about', :controller => 'home', :action => 'about'
  map.admin '/admin', :controller => 'home', :action => 'admin'
  map.privacy '/privacy', :controller => 'home', :action => 'privacy'
  map.privacy_2009_07_06 '/privacy-2009-07-06', :controller => 'home', :action => 'privacy-2009-07-06'
  map.example '/example', :controller => 'home', :action => 'example'
  map.verify '/verify', :controller => 'home', :action => 'verify'
  map.connect '/signup', :controller => 'users', :action => 'new'
  map.root :controller => 'home', :action => 'index'
  #map.toggle_question '/questions/:id/toggle', :controller => 'questions'
  map.abingoTest "/abingo/:action/:id", :controller=> :abingo_dashboard
  map.googletracking "/no_google_tracking", :controller=> :home, :action => :no_google_tracking
   
  
  map.connect '/export/:name', :controller => 'exports', :action => 'download'

  map.connect '/prompts/load_wikipedia_marketplace', :controller => 'prompts', :action => 'load_wikipedia_marketplace'
  map.connect '/wikipedia-banner-challenge/gallery', :controller => 'home', :action => 'wikipedia_banner_challenge_gallery'

  map.earl '/:id', :controller => 'earls', :action => 'show'
  map.earl_verify '/:id/v/:code', :controller => 'earls', :action => 'verify'
  map.add_photos '/:id/addphotos', :controller => 'questions', :action => 'add_photos'
  map.connect '/:id/:action', :controller => 'questions'
  # rake routes
  # http://guides.rubyonrails.org/routing.html
end
